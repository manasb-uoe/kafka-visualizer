package com.enthusiast94.kafkatopicviewer.domain;

import jdk.nashorn.internal.ir.Assignment;

import java.util.List;
import java.util.Objects;

public class KafkaConsumerInfo {
    public String consumerId;
    public String clientId;
    public List<Assignment> assignments;

    public KafkaConsumerInfo(String consumerId, String clientId, List<Assignment> assignments) {
        this.consumerId = consumerId;
        this.clientId = clientId;
        this.assignments = assignments;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KafkaConsumerInfo that = (KafkaConsumerInfo) o;
        return Objects.equals(consumerId, that.consumerId) &&
                Objects.equals(clientId, that.clientId) &&
                Objects.equals(assignments, that.assignments);
    }

    @Override
    public int hashCode() {
        return Objects.hash(consumerId, clientId, assignments);
    }

    @Override
    public String toString() {
        return "KafkaConsumerInfo{" +
                "consumerId='" + consumerId + '\'' +
                ", clientId='" + clientId + '\'' +
                ", assignments=" + assignments +
                '}';
    }

    public static class Assignment {
        public String topic;
        public int partition;

        public Assignment(String topic, int partition) {
            this.topic = topic;
            this.partition = partition;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Assignment that = (Assignment) o;
            return partition == that.partition &&
                    Objects.equals(topic, that.topic);
        }

        @Override
        public int hashCode() {
            return Objects.hash(topic, partition);
        }

        @Override
        public String toString() {
            return "Assignment{" +
                    "topic='" + topic + '\'' +
                    ", partition=" + partition +
                    '}';
        }
    }
}
