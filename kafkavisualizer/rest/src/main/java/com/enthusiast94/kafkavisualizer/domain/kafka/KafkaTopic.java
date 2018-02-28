package com.enthusiast94.kafkavisualizer.domain.kafka;

import java.util.Objects;

public class KafkaTopic {
    public String name;
    public int numPartitions;

    public KafkaTopic(String name, int numPartitions) {
        this.name = name;
        this.numPartitions = numPartitions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KafkaTopic that = (KafkaTopic) o;
        return numPartitions == that.numPartitions &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, numPartitions);
    }

    @Override
    public String toString() {
        return "KafkaTopic{" +
                "name='" + name + '\'' +
                ", numPartitions=" + numPartitions +
                '}';
    }
}
