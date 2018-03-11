import { IApi } from './Api';
import { Observable, Subject } from 'rxjs';
import Topic from '../domain/Topic';

export class MockApi implements IApi {

    private static readonly DELAY = 2000;

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
            }
        ];

        setTimeout(() => subject.next(topics), MockApi.DELAY);

        return subject.asObservable();
    }
}