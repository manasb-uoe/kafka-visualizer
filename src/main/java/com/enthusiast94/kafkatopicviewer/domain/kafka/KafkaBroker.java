package com.enthusiast94.kafkatopicviewer.domain.kafka;

public class KafkaBroker {
    public String hostname;
    public int port;

    public KafkaBroker(String hostname, int port) {
        this.hostname = hostname;
        this.port = port;
    }
}
