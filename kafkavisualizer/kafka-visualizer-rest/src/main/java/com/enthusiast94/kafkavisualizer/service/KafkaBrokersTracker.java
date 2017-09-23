package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaBroker;
import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Sets;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.javafx.collections.ObservableSetWrapper;
import javafx.collections.ObservableSet;
import javafx.collections.SetChangeListener;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import static com.google.common.util.concurrent.Uninterruptibles.awaitUninterruptibly;

public class KafkaBrokersTracker implements AutoCloseable {

    private static final Logger log = LoggerFactory.getLogger(KafkaBrokersTracker.class);

    private final ZooKeeper zooKeeper;
    private final JsonParser jsonParser = new JsonParser();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final ObservableSet<KafkaBroker> brokers = new ObservableSetWrapper<>(Collections.synchronizedSet(new HashSet<>()));
    private final AtomicLong version = new AtomicLong();
    private final AtomicBoolean started = new AtomicBoolean();

    public KafkaBrokersTracker(ZooKeeper zooKeeper) {
        this.zooKeeper = zooKeeper;
    }

    public void start() {
        if (started.get()) {
            throw new DefectException("Can only be started once!");
        }

        started.set(true);
        brokers.addListener((SetChangeListener<KafkaBroker>) change -> version.incrementAndGet());

        executor.submit(() -> {
            waitForBrokersPathToExist();
            watchBrokersPathForNewNodes();
        });
    }

    public Optional<Set<KafkaBroker>> getBrokers(long clientVersion) {
        if (clientVersion != 0 && clientVersion <= version.get()) {
            return Optional.empty();
        }

        return Optional.of(brokers);
    }

    private void waitForBrokersPathToExist() {
        CountDownLatch latch = new CountDownLatch(1);

        try {
            Stat exists = zooKeeper.exists("/brokers/ids", event -> {
                if (event.getType() == Watcher.Event.EventType.NodeCreated) {
                    if (event.getPath().equals("/brokers/ids")) {
                        latch.countDown();
                    }
                }
            });
            if (exists != null) {
                latch.countDown();
            }
        } catch (Exception e) {
            log.error("Exception while waiting for /brokers/topics path to exist", e);
            throw new DefectException(e);
        }

        awaitUninterruptibly(latch);
    }

    private void watchBrokersPathForNewNodes() {
        try {
            Set<String> brokerIds = ImmutableSet.copyOf(zooKeeper.getChildren("/brokers/ids", event -> {
                if (event.getType() == Watcher.Event.EventType.NodeChildrenChanged) {
                    try {
                        updateBrokersList(ImmutableSet.copyOf(zooKeeper.getChildren("/brokers/ids", null)));
                    } catch (Exception e) {
                        log.error(String.format("Exception getting children of brokers path [%s]", e.getMessage()), e);
                        throw new DefectException(e);
                    }
                }
            }));

            updateBrokersList(brokerIds);
        } catch (Exception e) {
            log.error(String.format("Exception getting children of brokers path [%s]", e.getMessage()), e);
            throw new DefectException(e);
        }
    }

    private void updateBrokersList(Set<String> newBrokerIds) {
        Set<String> currentBrokers = brokers.stream().map(b -> b.id).collect(Collectors.toSet());
        Set<String> brokersToAdd = Sets.difference(newBrokerIds, currentBrokers);
        Set<String> brokersToRemove = Sets.difference(currentBrokers, newBrokerIds);

        brokersToAdd.forEach(brokerId -> {
            String jsonString;

            try {
                jsonString = new String(zooKeeper.getData("/brokers/ids/" + brokerId, false, null));
            } catch (Exception e) {
                log.error(String.format("Exception when fetching broker data for broker [%s]", brokerId));
                throw new DefectException(e);
            }

            JsonObject json = jsonParser.parse(jsonString).getAsJsonObject();
            brokers.add(new KafkaBroker(brokerId, json.get("host").getAsString(), json.get("port").getAsInt()));
        });

        brokersToRemove.forEach(brokerId -> {
            KafkaBroker brokerToRemove = brokers.stream().
                    filter(broker -> broker.id.equals(brokerId))
                    .findFirst().orElseThrow(() -> new DefectException(String.format("No broker found with id [%s]", brokerId)));
            brokers.remove(brokerToRemove);
        });
    }

    @Override
    public void close() throws Exception {
        executor.shutdownNow();
    }
}
