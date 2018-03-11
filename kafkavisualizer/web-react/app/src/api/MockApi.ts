import { IApi } from './Api';
import { Observable, Subject } from 'rxjs';
import Topic from '../domain/Topic';

export class MockApi implements IApi {

    private static readonly DELAY = 1000;

    public getTopics(): Observable<Topic[]> {
        const subject = new Subject<Topic[]>();
        const topics = [
            <Topic> {
                name: 'TopicOne',
                numPartitions: 1
            },
            <Topic> {
                name: 'TopicTwo',
                numPartitions: 2
            },
            <Topic> {
                name: 'TopicThree',
                numPartitions: 2
            },
            <Topic> {
                name: 'TopicFour',
                numPartitions: 2
            },
            <Topic> {
                name: 'TopicFive',
                numPartitions: 4
            },
            <Topic> {
                name: 'TopicSix',
                numPartitions: 1
            }
        ];

        setTimeout(() => subject.next(topics), MockApi.DELAY);

        return subject.asObservable();
    }
}