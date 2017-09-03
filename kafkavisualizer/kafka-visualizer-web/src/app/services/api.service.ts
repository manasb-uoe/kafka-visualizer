import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {KafkaTopic} from "../domain/KafkaTopic";
import {TopicMessage} from "../domain/TopicMessage";
import {Consumer} from "../domain/Consumer";
import {KafkaBroker} from "../domain/KafkaBroker";

@Injectable()
export class ApiService {

    public constructor(private http: Http) {
    }

    public getBrokers(): Observable<Array<KafkaBroker>> {
        return this.http.get("/api/brokers").map(response => response.json());
    }

    public getTopics(): Observable<Array<KafkaTopic>> {
        return this.http.get("/api/topics").map(response => response.json());
    }

    public getTopicData(topic: KafkaTopic, partition: number): Observable<Array<TopicMessage>> {
        return this.http.get(`/api/topics/${topic.name}/${partition}`).map(response => response.json());
    }

    public getTopicConsumers(topic: KafkaTopic, partition: number): Observable<Array<Consumer>> {
        return this.http.get(`/api/consumers/${topic.name}/${partition}`).map(response => response.json());
    }
}
