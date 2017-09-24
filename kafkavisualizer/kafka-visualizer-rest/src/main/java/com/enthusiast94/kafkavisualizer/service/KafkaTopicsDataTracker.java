package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.TopicPartition;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

public class KafkaTopicsDataTracker {

    private static final Logger log = LogManager.getLogger(KafkaTopicsDataTracker.class);

    private final KafkaAllTopicsConsumer kafkaAllTopicsConsumer;
    private final int maxTopicMessagesCount;
    private final Map<TopicPartition, LinkedList<ConsumerRecord<String, String>>> consumedMessagesMap = new HashMap<>();
    private final AtomicBoolean started = new AtomicBoolean();
    private final AtomicLong version = new AtomicLong();

    public KafkaTopicsDataTracker(KafkaAllTopicsConsumer kafkaAllTopicsConsumer, int maxTopicMessagesCount) {
        this.kafkaAllTopicsConsumer = kafkaAllTopicsConsumer;
        this.maxTopicMessagesCount = maxTopicMessagesCount;
    }

    public void start() {
        if (!started.compareAndSet(false, true)) {
            throw new DefectException("Can only be started once!");
        }

        kafkaAllTopicsConsumer.subscribe(this::onMessageConsumed);
    }

    public synchronized Optional<ImmutableList<ConsumerRecord<String, String>>> getRecords(TopicPartition topicPartition, long clientVersion) {
        if (clientVersion != 0 && clientVersion <= version.get()) {
            return Optional.empty();

        }

        LinkedList<ConsumerRecord<String, String>> messages = consumedMessagesMap.get(topicPartition);
        if (messages == null) {
            return Optional.of(ImmutableList.of());
        }

        return Optional.of(ImmutableList.copyOf(messages));
    }

    private synchronized void onMessageConsumed(ConsumerRecord<String, String> record) {
        log.info(String.format("Consumed message: [%s]", record));

        TopicPartition topicPartition = new TopicPartition(record.topic(), record.partition());

        if (!consumedMessagesMap.containsKey(topicPartition)) {
            consumedMessagesMap.put(topicPartition, Lists.newLinkedList());
        }

        LinkedList<ConsumerRecord<String, String>> messages = consumedMessagesMap.get(topicPartition);
        messages.addFirst(record);

        if (messages.size() > maxTopicMessagesCount) {
            messages.removeLast();
        }

        version.incrementAndGet();
    }
}
