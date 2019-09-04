package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaTopic;
import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Sets;
import org.I0Itec.zkclient.ZkClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

public class KafkaTopicsTracker implements AutoCloseable {

    private static final Logger log = LoggerFactory.getLogger(KafkaBrokersTracker.class);

    private final ZkClient zkClient;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final ConcurrentHashMap<String, KafkaTopic> topicsByName = new ConcurrentHashMap<>();
    private final AtomicLong version = new AtomicLong();
    private final AtomicBoolean started = new AtomicBoolean();

    public KafkaTopicsTracker(ZkClient zkClient) {
        this.zkClient = zkClient;
    }

    public void start() {
        if (!started.compareAndSet(false, true)) {
            throw new DefectException("Can only be started once!");
        }

        zkClient.waitUntilExists("/brokers", TimeUnit.SECONDS, 10);

        executor.submit(() -> {
            zkClient.subscribeChildChanges("/brokers/topics", (parentPath, currentChilds) ->
                    updateTopics(ImmutableSet.copyOf(currentChilds)));
            updateTopics(ImmutableSet.copyOf(zkClient.getChildren("/brokers/topics")));
        });
    }

    public Optional<VersionedResponse<ImmutableList<KafkaTopic>>> getTopics(long clientVersion) {
        if (clientVersion != 0 && clientVersion >= version.get()) {
            return Optional.empty();
        }

        return Optional.of(new VersionedResponse<>(version.get(), ImmutableList.copyOf(topicsByName.values())));
    }

    private void updateTopics(Set<String> topicNames) {
        var currentTopics = topicsByName.keySet();
        var topicsToAdd = Sets.difference(topicNames, currentTopics);
        var topicsToRemove = Sets.difference(currentTopics, topicNames);

        topicsToAdd.stream()
                .filter(topicName -> !topicName.equals("__consumer_offsets"))
                .forEach(topicName -> {
                    try {
                        var partitionsPath = "/brokers/topics/" + topicName + "/partitions";
                        zkClient.waitUntilExists(partitionsPath, TimeUnit.SECONDS, 5);
                        topicsByName.put(topicName, new KafkaTopic(topicName, zkClient.getChildren(partitionsPath).size()));
                        version.incrementAndGet();
                        log.info("Topic added: [{}]", topicName);
                    } catch (Exception e) {
                        log.error("Exception fetching info for topic [{}]: {}", topicName, e.getMessage(), e);
                    }
                });

        topicsToRemove.forEach(topicName -> {
            topicsByName.remove(topicName);
            version.incrementAndGet();
            log.info("Topic deleted: [{}]", topicName);
        });
    }

    @Override
    public void close() {
        executor.shutdownNow();
    }
}
