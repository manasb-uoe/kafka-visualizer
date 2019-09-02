import { Consumer } from './../domain/Consumer';
import { Observable, Subject } from 'rxjs';
import Topic from '../domain/Topic';
import Broker from '../domain/Broker';
import TopicMessage from '../domain/TopicMessage';
import RecordMetadata from '../domain/RecordMetadata';

export interface IApi {
    getTopics(): Observable<Array<Topic>>;
    getBrokers(): Observable<Array<Broker>>;
    getTopicMessages(topic: Topic, partition: number, query: string): Observable<Array<TopicMessage>>;
    publishTopicMessage(topic: Topic, key: string, value: string): Observable<RecordMetadata>;
    getTopicConsumers(topic: Topic, partition: number): Observable<Array<Consumer>>;
}

class Api implements IApi {

    public getTopics(): Observable<Array<Topic>> {
        return this.getVersionedResponseStream('/api/topics', 2000);
    }

    public getBrokers(): Observable<Broker[]> {
        return this.getVersionedResponseStream('/api/brokers', 2000);
    }

    public publishTopicMessage(topic: Topic, key: string, value: string): Observable<RecordMetadata> {
        const body = new URLSearchParams();
        body.append('key', key);
        body.append('value', value);

        const subject = new Subject<RecordMetadata>();

        fetch(`/api/topics/${topic.name}`, {
            method: 'post',
            body: body.toString()
        })
            .then((response) => response.json())
            .then(jsonResponse => {
                subject.next({
                    offset: jsonResponse.offset,
                    partition: jsonResponse.topicPartition.partition
                });
            })
            .catch(error => subject.error(error));

        return subject.asObservable();
    }

    public getTopicMessages(topic: Topic, partition: number, query: string): Observable<TopicMessage[]> {
        if (!query) {
            query = '';
        }

        return this.getVersionedResponseStream(
            `/api/topics/${topic.name}/${partition}?query=${query}&`,
            2000
        );
    }

    getTopicConsumers(topic: Topic, partition: number): Observable<Consumer[]> {
        const subject = new Subject<Consumer[]>();
        fetch(`/api/consumers/${topic.name}/${partition}`)
            .then((response) => response.json())
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    return subject.error(jsonResponse.error);
                }
                return subject.next(jsonResponse);
            })
            .catch(error => subject.error(error));

        return subject.asObservable();
    }

    private getVersionedResponseStream<T>(endpoint: string, period: number): Observable<T> {
        return this.getResponseStream(endpoint, period, true);
    }

    private getResponseStream<T>(endpoint: string, period: number, isVersioned: boolean): Observable<T> {
        const subject = new Subject<T>();
        let version = 0;

        const handler = () => {
            fetch(isVersioned ? this.createVersionedEndpoint(endpoint, version) : endpoint)
                .then(response => {
                    if (response.status === 304) {
                        throw new Error(response.status.toString());
                    } else {
                        return response.json();
                    }
                })
                .then(
                    response => {
                        if (response.error) {
                            subject.error(response.error);
                        } else if (isVersioned) {
                            version = response.version;
                            subject.next(response.data);
                        } else {
                            subject.next(response);
                        }

                        setTimeout(handler, period);
                    })
                .catch(error => {
                    if (error.message !== '304') {
                        console.error(error);
                    }

                    setTimeout(handler, period);
                });
        };

        handler();
        return subject.asObservable();
    }

    private createVersionedEndpoint(endpoint: string, version: number): string {
        if (endpoint.endsWith('&')) {
            return `${endpoint}version=${version}`;
        } else {
            return `${endpoint}?version=${version}`;
        }
    }
}

export default new Api();
