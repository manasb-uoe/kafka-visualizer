package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaBroker;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaConsumerInfo;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaTopic;
import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import kafka.admin.AdminClient;
import kafka.coordinator.group.GroupOverview;
import org.I0Itec.zkclient.ZkClient;
import org.apache.log4j.Logger;
import org.apache.zookeeper.ZooKeeper;
import scala.collection.JavaConversions;

import java.time.Duration;
import java.util.List;

public class KafkaAdmin {
    private static final Logger log = Logger.getLogger(KafkaAdmin.class);

    private final ZkClient zkClient;
    private final ZooKeeper zooKeeper;
    private final AdminClient adminClient;
    private final JsonParser jsonParser = new JsonParser();

    public KafkaAdmin(ZkClient zkClient, ZooKeeper zooKeeper, AdminClient adminClient) {
        this.zkClient = zkClient;
        this.zooKeeper = zooKeeper;
        this.adminClient = adminClient;
    }

    public ImmutableList<KafkaBroker> getAllBrokers() {
        ImmutableList.Builder<KafkaBroker> brokersBuilder = ImmutableList.builder();
        ImmutableList<String> brokerIds = ImmutableList.copyOf(zkClient.getChildren("/brokers/ids"));

        for (String brokerId : brokerIds) {
            String jsonString = null;
            try {
                jsonString = new String(zooKeeper.getData("/brokers/ids/" + brokerId, false, null));
            } catch (Exception e) {
                throw new DefectException(String.format("Failed to fetch broker data for broker [%s]", brokerId));
            }
            JsonObject json = jsonParser.parse(jsonString).getAsJsonObject();
            KafkaBroker broker = new KafkaBroker(json.get("host").getAsString(), json.get("port").getAsInt());
            brokersBuilder.add(broker);
        }

        return brokersBuilder.build();
    }

    public ImmutableList<KafkaTopic> getAllTopics() {
        ImmutableList<String> topicNames = ImmutableList.copyOf(zkClient.getChildren("/brokers/topics"));
        return topicNames.stream()
                .filter(topicName -> !topicName.equals("__consumer_offsets"))
                .map(topicName -> new KafkaTopic(topicName, zkClient.getChildren("/brokers/topics/" +
                        topicName + "/partitions").size()))
                .collect(ImmutableList.toImmutableList());
    }

    public ImmutableMap<String, List<KafkaConsumerInfo>> getAllConsumerGroups() {
        ImmutableList<GroupOverview> consumerGroups =
                ImmutableList.copyOf(JavaConversions.asJavaCollection(adminClient.listAllConsumerGroupsFlattened()));
        ImmutableMap.Builder<String, List<KafkaConsumerInfo>> consumersMapBuilder = ImmutableMap.builder();

        consumerGroups.forEach(consumerGroup -> {
            AdminClient.ConsumerGroupSummary consumerGroupSummary = adminClient.describeConsumerGroup(
                    consumerGroup.groupId(), Duration.ofSeconds(10).toMillis());

            if (!consumerGroupSummary.consumers().isDefined()) {
                return;
            }

            ImmutableList<AdminClient.ConsumerSummary> consumerSummaries = ImmutableList.copyOf(
                    JavaConversions.asJavaCollection(consumerGroupSummary.consumers().get()));

            if (consumerSummaries.isEmpty()) {
                return;
            }

            ImmutableList<KafkaConsumerInfo> consumerInfos = convertToKafkaConsumerInfos(consumerSummaries);
            consumersMapBuilder.put(consumerGroup.groupId(), consumerInfos);
        });

        return consumersMapBuilder.build();
    }

    private ImmutableList<KafkaConsumerInfo> convertToKafkaConsumerInfos(ImmutableList<AdminClient.ConsumerSummary> consumerSummaries) {
        return consumerSummaries.stream()
                .map(consumerSummary -> {
                    ImmutableList<KafkaConsumerInfo.Assignment> assignments = JavaConversions.asJavaCollection(consumerSummary.assignment())
                            .stream()
                            .map(assignment -> new KafkaConsumerInfo.Assignment(assignment.topic(), assignment.partition()))
                            .collect(ImmutableList.toImmutableList());

                    return new KafkaConsumerInfo(consumerSummary.consumerId(), consumerSummary.clientId(), assignments);
                })
                .collect(ImmutableList.toImmutableList());
    }
}
