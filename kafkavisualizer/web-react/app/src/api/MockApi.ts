import { IApi } from './Api';
import { Observable, Subject } from 'rxjs';
import Topic from '../domain/Topic';
import Broker from '../domain/Broker';

export class MockApi implements IApi {

    private static readonly DELAY = 0;

    public getTopics(): Observable<Topic[]>  {
        const subject = new Subject<Topic[]>();
        const topics: Topic[] = [
            { name: 'TopicOne', numPartitions: 1 },
            { name: 'TopicTwo', numPartitions: 1 },
            { name: 'TopicThree', numPartitions: 2 },
            { name: 'TopicFour', numPartitions: 4 },
        ];

        setTimeout(() => subject.next(topics), MockApi.DELAY);
        setTimeout(() => subject.next(topics.concat({ name: 'AnotherTopicThatGotAddedLater', numPartitions: 1 })), 6000);
        return subject.asObservable();
    }

    public getBrokers(): Observable<Broker[]> {
        const subject = new Subject<Broker[]>();
        const brokers: Broker[] = [
            { id: 1, hostname: 'localhost', port: 3001 },
            { id: 2, hostname: 'localhost', port: 3002 },
            { id: 3, hostname: 'localhost', port: 3003 }
        ];

        setTimeout(() => subject.next(brokers), MockApi.DELAY);

        return subject.asObservable();
    }
}