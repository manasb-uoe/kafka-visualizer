package com.enthusiast94.kafkatopicviewer.config;

import com.enthusiast94.kafkatopicviewer.domain.KafkaBroker;
import com.enthusiast94.kafkatopicviewer.domain.ZookeeperNode;
import com.google.common.collect.ImmutableList;

public class Config {
    public ImmutableList<KafkaBroker> kafkaBrokers;
    public ImmutableList<ZookeeperNode> zookeeperNodes;

    public Config(ImmutableList<KafkaBroker> kafkaBrokers, ImmutableList<ZookeeperNode> zookeeperNodes) {
        this.kafkaBrokers = kafkaBrokers;
        this.zookeeperNodes = zookeeperNodes;
    }

    @Override
    public String toString() {
        return "Config{" +
                "kafkaBrokers=" + kafkaBrokers +
                ", zookeeperNodes=" + zookeeperNodes +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Config config = (Config) o;

        if (!kafkaBrokers.equals(config.kafkaBrokers)) return false;
        return zookeeperNodes.equals(config.zookeeperNodes);
    }

    @Override
    public int hashCode() {
        int result = kafkaBrokers.hashCode();
        result = 31 * result + zookeeperNodes.hashCode();
        return result;
    }
}
