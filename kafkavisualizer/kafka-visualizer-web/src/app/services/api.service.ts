import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {KafkaTopic} from "../domain/KafkaTopic";
import {TopicMessage} from "../domain/TopicMessage";
import {Consumer} from "../domain/Consumer";
import {KafkaBroker} from "../domain/KafkaBroker";
import {RecordMetadata} from "../domain/RecordMetadata";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/map";

@Injectable()
export class ApiService {

    public constructor(private http: Http) {
    }

    public getEnvironment(): Observable<string> {
        return this.http.get("/api/environment").map(response => response.json());
    }

    public getBrokers(): Observable<Array<KafkaBroker>> {
        return this.getVersionedResponseStream("/api/brokers", 2000);
    }

    public getTopics(): Observable<Array<KafkaTopic>> {
        return this.getVersionedResponseStream("/api/topics", 2000);
    }

    public getTopicData(topic: KafkaTopic, partition: number): Observable<Array<TopicMessage>> {
        return this.getVersionedResponseStream(`/api/topics/${topic.name}/${partition}`, 2000);
    }

    public getTopicConsumers(topic: KafkaTopic, partition: number): Observable<Array<Consumer>> {
        return this.http.get(`/api/consumers/${topic.name}/${partition}`).map(response => response.json());
    }

    public publishTopicMessage(topic: KafkaTopic, key: string, value: string): Observable<RecordMetadata> {
        const body = new URLSearchParams();
        body.append("key", key);
        body.append("value", value);

        return this.http.post(`/api/topics/${topic.name}`, body.toString())
            .map((response: any) => {
                response = response.json();
                return new RecordMetadata(response.offset, response.topicPartition.partition);
            });
    }

    private getVersionedResponseStream<T>(endpoint: string, period: number): Observable<T> {
        return this.getResponseStream(endpoint, period, true);
    }

    private getResponseStream<T>(endpoint: string, period: number, isVersioned: boolean): Observable<T> {
        const subject = new Subject<T>();
        let version = 0;

        const handler = () => {
            this.http.get(isVersioned ? `${endpoint}?version=${version}` : endpoint)
                .map(response => response.json())
                .subscribe(
                    response => {
                        if (isVersioned) {
                            version = response.version;
                            subject.next(response.data);
                        } else {
                            subject.next(response);
                        }

                        setTimeout(handler, period);
                    },
                    error => {
                        if (error.status !== 304) {
                            console.error(error);
                        }

                        setTimeout(handler, period);
                    });
        };

        handler();
        return subject.asObservable();
    }
}
