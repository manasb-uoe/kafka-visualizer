package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaStatics;
import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.collect.ImmutableList;
import org.apache.kafka.clients.consumer.ConsumerRebalanceListener;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.Collection;
import java.util.Properties;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;
import java.util.regex.Pattern;

public class KafkaAllTopicsConsumer implements AutoCloseable {

    private final KafkaConsumer<String, String> kafkaConsumer;
    private final ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
    private final AtomicBoolean isSubscribed = new AtomicBoolean();

    public KafkaAllTopicsConsumer(String kafkaServersString) {
        Properties properties = new Properties();
        properties.put("bootstrap.servers", kafkaServersString);
        properties.put("group.id", KafkaStatics.GROUP_ID);
        properties.put("enable.auto.commit", "true");
        properties.put("metadata.max.age.ms", 5000);

        kafkaConsumer = new KafkaConsumer<>(properties, new StringDeserializer(), new StringDeserializer());
    }

    public void subscribe(Consumer<ConsumerRecord<String, String>> recordConsumer) {
        if (!isSubscribed.compareAndSet(false, true)) {
            throw new DefectException("Can only subscribe once!");
        }

        subscribeFromBeginning();

        executorService.scheduleAtFixedRate(() -> {
            ConsumerRecords<String, String> records = kafkaConsumer.poll(100);
            records.forEach(recordConsumer);
        }, 0, 1000, TimeUnit.MILLISECONDS);
    }

    private void subscribeFromBeginning() {
        kafkaConsumer.subscribe(Pattern.compile("^((?!__consumer_offsets).)*$"), new ConsumerRebalanceListener() {
            @Override
            public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
            }

            @Override
            public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
            }
        });
        kafkaConsumer.poll(0); // subscribe is lazy, and therefore we need to poll before seeking
        kafkaConsumer.seekToBeginning(ImmutableList.of());
    }

    @Override
    public void close() throws Exception {
        kafkaConsumer.close();
    }
}
