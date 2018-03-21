package com.enthusiast94.kafkavisualizer.service;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.TimeUnit;

public class KafkaProducerWrapper implements AutoCloseable {

    private final KafkaProducer<String, String> kafkaProducer;

    public KafkaProducerWrapper(String kafkaServersString) {
        var properties = new Properties();
        properties.put("bootstrap.servers", kafkaServersString);

        kafkaProducer = new KafkaProducer<>(properties, new StringSerializer(), new StringSerializer());
    }

    public RecordMetadata publish(String key, String value, String topicName) throws Exception {
        var record = new ProducerRecord<>(topicName, key, value);
        return kafkaProducer.send(record).get(5000, TimeUnit.MILLISECONDS);
    }

    @Override
    public void close() throws Exception {
        kafkaProducer.close();
    }
}
