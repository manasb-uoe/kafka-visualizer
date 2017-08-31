package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaConsumerWrapper;
import com.google.common.collect.EvictingQueue;
import com.google.common.collect.ImmutableList;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.TopicPartition;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.Map;

public class KafkaTopicsDataTracker {

    private static final Logger log = LogManager.getLogger(KafkaTopicsDataTracker.class);

    private final KafkaConsumerWrapper kafkaConsumerWrapper;
    private final int maxNumberOfMessagesToPersist;
    private final Map<TopicPartition, EvictingQueue<ConsumerRecord<String, String>>> consumedMessagesMap = new HashMap<>();

    public KafkaTopicsDataTracker(KafkaConsumerWrapper kafkaConsumerWrapper, int maxNumberOfMessagesToPersist) {
        this.kafkaConsumerWrapper = kafkaConsumerWrapper;
        this.maxNumberOfMessagesToPersist = maxNumberOfMessagesToPersist;
    }

    public void start() {
        kafkaConsumerWrapper.subscribe(this::onMessageConsumed);
    }

    public synchronized ImmutableList<ConsumerRecord<String, String>> getRecords(TopicPartition topicPartition) {
        EvictingQueue<ConsumerRecord<String, String>> messages = consumedMessagesMap.get(topicPartition);

        if (messages == null) {
            return ImmutableList.of();
        }

        return ImmutableList.copyOf(messages);
    }

    private synchronized void onMessageConsumed(ConsumerRecord<String, String> record) {
        log.info("Consumed message: " + record);

        TopicPartition topicPartition = new TopicPartition(record.topic(), record.partition());

        if (!consumedMessagesMap.containsKey(topicPartition)) {
            consumedMessagesMap.put(topicPartition, EvictingQueue.create(maxNumberOfMessagesToPersist));
        }

        consumedMessagesMap.get(topicPartition).add(record);
    }
}
