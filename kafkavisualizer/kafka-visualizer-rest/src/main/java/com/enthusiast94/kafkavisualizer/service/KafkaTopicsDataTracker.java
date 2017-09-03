package com.enthusiast94.kafkavisualizer.service;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.TopicPartition;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

public class KafkaTopicsDataTracker {

    private static final Logger log = LogManager.getLogger(KafkaTopicsDataTracker.class);

    private final KafkaConsumerWrapper kafkaConsumerWrapper;
    private final int maxTopicMessagesCount;
    private final Map<TopicPartition, LinkedList<ConsumerRecord<String, String>>> consumedMessagesMap = new HashMap<>();

    public KafkaTopicsDataTracker(KafkaConsumerWrapper kafkaConsumerWrapper,
                                  int maxTopicMessagesCount) {
        this.kafkaConsumerWrapper = kafkaConsumerWrapper;
        this.maxTopicMessagesCount = maxTopicMessagesCount;
    }

    public void start() {
        kafkaConsumerWrapper.subscribe(this::onMessageConsumed);
    }

    public synchronized ImmutableList<ConsumerRecord<String, String>> getRecords(TopicPartition topicPartition) {
        LinkedList<ConsumerRecord<String, String>> messages = consumedMessagesMap.get(topicPartition);

        if (messages == null) {
            return ImmutableList.of();
        }

        return ImmutableList.copyOf(messages);
    }

    private synchronized void onMessageConsumed(ConsumerRecord<String, String> record) {
        log.info("Consumed message: " + record);

        TopicPartition topicPartition = new TopicPartition(record.topic(), record.partition());

        if (!consumedMessagesMap.containsKey(topicPartition)) {
            consumedMessagesMap.put(topicPartition, Lists.newLinkedList());
        }

        LinkedList<ConsumerRecord<String, String>> messages = consumedMessagesMap.get(topicPartition);
        messages.addFirst(record);

        if (messages.size() > maxTopicMessagesCount) {
            messages.removeLast();
        }
    }
}
