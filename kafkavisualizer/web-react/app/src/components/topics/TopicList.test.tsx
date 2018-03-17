import * as React from 'react';
import { mount } from 'enzyme';
import { TopicList } from './TopicList';
import { ITopicsState } from '../../reducers/initialState';
import Topic from '../../domain/Topic';
import TopicListItem from './TopicListItem';

describe('<TopicList />', () => {

    // tslint:disable-next-line:no-any
    let loadAllTopics: any;
    // tslint:disable-next-line:no-any
    let selectTopic: any;

    beforeEach(() => {
        loadAllTopics = jest.fn();
        selectTopic = jest.fn();
    });

    it('should load topics on mount', () => {
        const topicsState: ITopicsState = { isLoading: false, items: [], error: '' };

        mount(<TopicList topics={topicsState} loadAllTopics={loadAllTopics} selectTopic={selectTopic} />);

        expect(loadAllTopics.mock.calls.length).toBe(1);
    });

    it('should show loading text when loading topics', () => {
        const topicsState: ITopicsState = { isLoading: true, items: [], error: '' };

        const wrapper = mount(<TopicList topics={topicsState} loadAllTopics={loadAllTopics} selectTopic={selectTopic} />);

        const listItems = wrapper.find('.sidebarListItem');
        expect(listItems.length).toBe(1);
        expect(listItems.get(0).props.children).toEqual('Loading...');
    });

    it('should not show any topics if none exist', () => {
        const topicsState: ITopicsState = { isLoading: false, items: [], error: '' };

        const wrapper = mount(<TopicList topics={topicsState} loadAllTopics={loadAllTopics} selectTopic={selectTopic} />);

        const listItems = wrapper.find('.sidebarListItem');
        expect(listItems.length).toBe(1);
        expect(listItems.get(0).props.children).toEqual('No topics found');
    });

    it('should show list of topics', () => {
        const topicItems: Topic[] = [{ name: 'TopicOne', numPartitions: 1 }, { name: 'TopicTwo', numPartitions: 2 }];
        const topicsState: ITopicsState = { isLoading: false, items: topicItems, error: '' };

        const wrapper = mount(<TopicList topics={topicsState} loadAllTopics={loadAllTopics} selectTopic={selectTopic} />);

        const listItems = wrapper.find(TopicListItem);
        expect(listItems.length).toBe(2);
        expect(listItems.at(0).find('span').text()).toEqual(topicItems[0].name);
        expect(listItems.at(0).find('.text-primary').text()).toEqual(topicItems[0].numPartitions.toString());
        expect(listItems.at(1).find('span').text()).toEqual(topicItems[1].name);
        expect(listItems.at(1).find('.text-primary').text()).toEqual(topicItems[1].numPartitions.toString());
    });

    it('should select topic on click', () => {
        const topicItems: Topic[] = [{ name: 'TopicOne', numPartitions: 1 }];
        const topicsState: ITopicsState = { isLoading: false, items: topicItems, error: '' };

        const wrapper = mount(<TopicList topics={topicsState} loadAllTopics={loadAllTopics} selectTopic={selectTopic} />);
    
        const listItem = wrapper.find(TopicListItem).at(0);
        expect(selectTopic.mock.calls.length).toBe(0);   

        listItem.simulate('click');
        
        expect(selectTopic.mock.calls.length).toBe(1);
        expect(selectTopic.mock.calls[0][0]).toEqual(topicItems[0]);
    });

    it('should highlight selected topic', () => {
        const topicItems: Topic[] = [{ name: 'TopicOne', numPartitions: 1 }];
        const topicsState: ITopicsState = { isLoading: false, items: topicItems, error: '', selectedTopic: topicItems[0] };

        const wrapper = mount(<TopicList topics={topicsState} loadAllTopics={loadAllTopics} selectTopic={selectTopic} />);
        
        const listItem = wrapper.find(TopicListItem).at(0);
        expect(listItem.find('.selected').length).toBe(1);        
    });
});