package com.enthusiast94.kafkavisualizer.domain.kafka;

public class KafkaBroker {
    public final String id;
    public final String hostname;
    public final int port;

    public KafkaBroker(String id, String hostname, int port) {
        this.id = id;
        this.hostname = hostname;
        this.port = port;
    }
}
