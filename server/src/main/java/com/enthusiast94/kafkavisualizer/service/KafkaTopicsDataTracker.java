package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaConsumerWrapper;
import com.google.common.collect.*;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.TopicPartition;
import org.apache.log4j.Logger;

public class KafkaTopicsDataTracker {

    private static final Logger log = Logger.getLogger(KafkaTopicsDataTracker.class);

    private final KafkaConsumerWrapper kafkaConsumerWrapper;
    private final Multimap<TopicPartition, ConsumerRecord<String, String>> consumedMessagesMap =
            Multimaps.synchronizedListMultimap(ArrayListMultimap.create());

    public KafkaTopicsDataTracker(KafkaConsumerWrapper kafkaConsumerWrapper) {
        this.kafkaConsumerWrapper = kafkaConsumerWrapper;
    }

    public void start() {
        kafkaConsumerWrapper.subscribe(this::onMessageConsumed);
    }

    public ImmutableList<ConsumerRecord<String, String>> getRecords(TopicPartition topicPartition) {
        return ImmutableList.copyOf(consumedMessagesMap.get(topicPartition));
    }

    private void onMessageConsumed(ConsumerRecord<String, String> record) {
        log.info("Consumed message: " + record);
        consumedMessagesMap.put(new TopicPartition(record.topic(), record.partition()), record);
    }
}
