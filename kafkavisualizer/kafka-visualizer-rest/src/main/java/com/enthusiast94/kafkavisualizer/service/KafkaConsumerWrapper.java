package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaStatics;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaTopic;
import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.collect.ImmutableList;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.Properties;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;

public class KafkaConsumerWrapper implements AutoCloseable {

    private final KafkaConsumer<String, String> kafkaConsumer;
    private final ImmutableList<KafkaTopic> topics;
    private final ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
    private final AtomicReference<Boolean> isSubscribed = new AtomicReference<>(false);

    public KafkaConsumerWrapper(String kafkaServersString, ImmutableList<KafkaTopic> topics) {
        this.topics = topics;

        if (topics.isEmpty()) {
            throw new IllegalArgumentException("No topics provided! Consumer must be provided with at least one " +
                    "topic to subscribe.");
        }

        Properties properties = new Properties();
        properties.put("bootstrap.servers", kafkaServersString);
        properties.put("group.id", KafkaStatics.GROUP_ID);
        properties.put("enable.auto.commit", "true");

        kafkaConsumer = new KafkaConsumer<>(properties, new StringDeserializer(), new StringDeserializer());
    }

    public void subscribe(Consumer<ConsumerRecord<String, String>> recordConsumer) {
        if (isSubscribed.get()) {
            throw new DefectException("Can only subscribe once!");
        }

        isSubscribed.set(true);

        subscribeFromBeginning();

        executorService.scheduleAtFixedRate(() -> {
            ConsumerRecords<String, String> records = kafkaConsumer.poll(100);
            records.forEach(recordConsumer);
        }, 0, 1000, TimeUnit.MILLISECONDS);
    }

    private void subscribeFromBeginning() {
        ImmutableList<String> topicNames = topics.stream().map(topic -> topic.name).collect(ImmutableList.toImmutableList());
        kafkaConsumer.subscribe(topicNames);
        kafkaConsumer.poll(0); // subscribe is lazy, and therefore we need to poll before seeking
        kafkaConsumer.seekToBeginning(ImmutableList.of());
    }

    @Override
    public void close() throws Exception {
        kafkaConsumer.close();
    }
}
