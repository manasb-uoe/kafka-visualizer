package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaBroker;
import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Sets;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.javafx.collections.ObservableMapWrapper;
import javafx.collections.MapChangeListener;
import javafx.collections.ObservableMap;
import org.I0Itec.zkclient.ZkClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

public class KafkaBrokersTracker implements AutoCloseable {

    private static final Logger log = LoggerFactory.getLogger(KafkaBrokersTracker.class);

    private final ZkClient zkClient;
    private final JsonParser jsonParser = new JsonParser();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final ObservableMap<String, KafkaBroker> brokersById = new ObservableMapWrapper<>(Collections.synchronizedMap(new ConcurrentHashMap<>()));
    private final AtomicLong version = new AtomicLong();
    private final AtomicBoolean started = new AtomicBoolean();

    public KafkaBrokersTracker(ZkClient zkClient) {
        this.zkClient = zkClient;
    }

    public void start() {
        if (!started.compareAndSet(false, true)) {
            throw new DefectException("Can only be started once!");
        }

        brokersById.addListener((MapChangeListener<String, KafkaBroker>) change -> version.incrementAndGet());
        zkClient.waitUntilExists("/brokers", TimeUnit.SECONDS, 10);

        executor.submit(() -> {
            zkClient.subscribeChildChanges("/brokers/ids", (parentPath, currentChilds) ->
                    updateBrokers(ImmutableSet.copyOf(currentChilds)));
            updateBrokers(ImmutableSet.copyOf(zkClient.getChildren("/brokers/ids")));
        });
    }

    public Optional<VersionedResponse<ImmutableList<KafkaBroker>>> getBrokers(long clientVersion) {
        if (clientVersion != 0 && clientVersion <= version.get()) {
            return Optional.empty();
        }

        return Optional.of(new VersionedResponse<>(version.get(), ImmutableList.copyOf(brokersById.values())));
    }

    private void updateBrokers(Set<String> newBrokerIds) {
        Set<String> currentBrokers = brokersById.keySet();
        Set<String> brokersToAdd = Sets.difference(newBrokerIds, currentBrokers);
        Set<String> brokersToRemove = Sets.difference(currentBrokers, newBrokerIds);

        brokersToAdd.forEach(brokerId -> {
            try {
                String jsonString = zkClient.readData("/brokers/ids/" + brokerId);
                JsonObject json = jsonParser.parse(jsonString).getAsJsonObject();
                brokersById.put(brokerId, new KafkaBroker(brokerId, json.get("host").getAsString(), json.get("port").getAsInt()));
                log.info("Broker added: [{}]", brokerId);
            } catch (Exception e) {
                log.error("Exception fetching broker info for broker [{}]: ", brokerId, e.getMessage(), e);
            }
        });

        brokersToRemove.forEach(brokerId -> {
            brokersById.remove(brokerId);
            log.info("Broker deleted: [{}]", brokerId);
        });
    }

    @Override
    public void close() throws Exception {
        executor.shutdownNow();
    }
}
