import { Observable, Subject } from 'rxjs';
import Topic from '../domain/Topic';
import * as envVars from '../constants/envVariables';
import { MockApi } from './MockApi';
import Broker from '../domain/Broker';
import TopicMessage from '../domain/TopicMessage';

export interface IApi {
    getTopics(): Observable<Array<Topic>>;
    getBrokers(): Observable<Array<Broker>>;
    getTopicMessages(topic: Topic, partition: number, query: string): Observable<Array<TopicMessage>>;
}

class Api implements IApi {

    public getTopics(): Observable<Array<Topic>> {
        return this.getVersionedResponseStream('/api/topics', 2000);
    }

    public getBrokers(): Observable<Broker[]> {
        return this.getVersionedResponseStream('/api/brokers', 2000);
    }

    getTopicMessages(topic: Topic, partition: number, query: string): Observable<TopicMessage[]> {
        if (!query) {
            query = '';
        }

        return this.getVersionedResponseStream(
            `/api/topics/${topic.name}/${partition}?query=${query}&`,
            2000
        );
    }

    private getVersionedResponseStream<T>(endpoint: string, period: number): Observable<T> {
        return this.getResponseStream(endpoint, period, true);
    }

    private getResponseStream<T>(endpoint: string, period: number, isVersioned: boolean): Observable<T> {
        const subject = new Subject<T>();
        let version = 0;

        const handler = () => {
            fetch(isVersioned ? this.createVersionedEndpoint(endpoint, version) : endpoint)
                .then(response => response.json())
                .then(
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

    private createVersionedEndpoint(endpoint: string, version: number): string {
        if (endpoint.endsWith('&')) {
            return `${endpoint}version=${version}`;
        } else {
            return `${endpoint}?version=${version}`;
        }
    }
}

let api: IApi;
if (process.env.NODE_ENV === envVars.ENVIRONMENT.DEV) {
    api = new MockApi();
} else {
    api = new Api();
}

export default api;
