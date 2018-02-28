package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.MaxTopicMessageCount;
import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.base.Strings;
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
    private final MaxTopicMessageCount maxTopicMessagesCount;
    private final Map<TopicPartition, VersionedMessages> messagesByTopicPartition = new HashMap<>();
    private final AtomicBoolean started = new AtomicBoolean();

    public KafkaTopicsDataTracker(KafkaAllTopicsConsumer kafkaAllTopicsConsumer, MaxTopicMessageCount maxTopicMessagesCount) {
        this.kafkaAllTopicsConsumer = kafkaAllTopicsConsumer;
        this.maxTopicMessagesCount = maxTopicMessagesCount;
    }

    public void start() {
        if (!started.compareAndSet(false, true)) {
            throw new DefectException("Can only be started once!");
        }

        kafkaAllTopicsConsumer.subscribe(this::onMessageConsumed);
    }

    public synchronized Optional<VersionedResponse<ImmutableList<ConsumerRecord<String, String>>>> getRecords(TopicPartition topicPartition,
                                                                                                              long clientVersion,
                                                                                                              String query) {
        if (!messagesByTopicPartition.containsKey(topicPartition)) {
            return Optional.of(new VersionedResponse<>(0, ImmutableList.of()));
        }

        VersionedMessages versionedMessages = messagesByTopicPartition.get(topicPartition);

        if (clientVersion != 0 && clientVersion >= versionedMessages.version.get()) {
            return Optional.empty();
        }

        ImmutableList<ConsumerRecord<String, String>> filteredMessages;

        if (Strings.isNullOrEmpty(query)) {
            filteredMessages = ImmutableList.copyOf(versionedMessages.messages);
        } else {
            filteredMessages = versionedMessages.messages.stream()
                    .filter(message -> message.value().contains(query))
                    .collect(ImmutableList.toImmutableList());
        }

        return Optional.of(new VersionedResponse<>(versionedMessages.version.get(), filteredMessages));
    }

    private synchronized void onMessageConsumed(ConsumerRecord<String, String> record) {
        log.info(String.format("Consumed message: [%s]", record));

        TopicPartition topicPartition = new TopicPartition(record.topic(), record.partition());

        if (!messagesByTopicPartition.containsKey(topicPartition)) {
            messagesByTopicPartition.put(topicPartition, new VersionedMessages(Lists.newLinkedList()));
        }

        VersionedMessages versionedMessages = messagesByTopicPartition.get(topicPartition);
        LinkedList<ConsumerRecord<String, String>> messages = versionedMessages.messages;
        messages.addFirst(record);

        if (!maxTopicMessagesCount.equals(MaxTopicMessageCount.EMPTY) && messages.size() > maxTopicMessagesCount.value) {
            messages.removeLast();
        }

        versionedMessages.version.incrementAndGet();
    }

    private static class VersionedMessages {
        final AtomicLong version = new AtomicLong();
        final LinkedList<ConsumerRecord<String, String>> messages;

        private VersionedMessages(LinkedList<ConsumerRecord<String, String>> messages) {
            this.messages = messages;
        }
    }
}
