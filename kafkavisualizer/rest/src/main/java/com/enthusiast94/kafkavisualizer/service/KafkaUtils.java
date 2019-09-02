package com.enthusiast94.kafkavisualizer.service;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaBroker;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaConsumerInfo;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaStatics;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaTopic;
import com.google.common.collect.ImmutableList;
import com.google.gson.JsonParser;
import kafka.admin.AdminClient;
import org.I0Itec.zkclient.ZkClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import scala.collection.JavaConversions;

import java.time.Duration;

public class KafkaUtils {

    private static final Logger log = LoggerFactory.getLogger(KafkaUtils.class);

    private final ZkClient zkClient;
    private final AdminClient adminClient;
    private final JsonParser jsonParser = new JsonParser();

    public KafkaUtils(ZkClient zkClient, AdminClient adminClient) {
        this.zkClient = zkClient;
        this.adminClient = adminClient;
    }

    public ImmutableList<KafkaBroker> getAllBrokers() throws Exception {
        var brokersBuilder = ImmutableList.<KafkaBroker>builder();
        var brokerIds = ImmutableList.copyOf(zkClient.getChildren("/brokers/ids"));

        for (String brokerId : brokerIds) {
            String jsonString;
            try {
                jsonString = zkClient.readData("/brokers/ids/" + brokerId);
            } catch (Exception e) {
                throw new Exception(String.format("Failed to fetch broker data for broker [%s]", brokerId));
            }
            var json = jsonParser.parse(jsonString).getAsJsonObject();
            var broker = new KafkaBroker(brokerId, json.get("host").getAsString(), json.get("port").getAsInt());
            brokersBuilder.add(broker);
        }

        return brokersBuilder.build();
    }

    public ImmutableList<KafkaTopic> getAllTopics() {
        var topicNames = ImmutableList.copyOf(zkClient.getChildren("/brokers/topics"));
        return topicNames.stream()
                .filter(topicName -> !topicName.equals("__consumer_offsets"))
                .map(topicName -> new KafkaTopic(topicName, zkClient.getChildren("/brokers/topics/" +
                        topicName + "/partitions").size()))
                .collect(ImmutableList.toImmutableList());
    }

    public ImmutableList<KafkaConsumerInfo> getAllConsumers() {
        var consumerGroups =
                ImmutableList.copyOf(JavaConversions.asJavaCollection(adminClient.listAllConsumerGroupsFlattened()));

        var consumers = ImmutableList.<KafkaConsumerInfo>builder();

        consumerGroups.stream()
                .filter(groupOverview -> !groupOverview.groupId().equals(KafkaStatics.GROUP_ID))
                .forEach(consumerGroup -> {
                    var consumerGroupSummary =
                            adminClient.describeConsumerGroup(consumerGroup.groupId(), Duration.ofSeconds(10).toMillis());

                    if (!consumerGroupSummary.consumers().isDefined()) {
                        return;
                    }

                    var consumerSummaries = ImmutableList.copyOf(
                            JavaConversions.asJavaCollection(consumerGroupSummary.consumers().get()));

                    if (consumerSummaries.isEmpty()) {
                        return;
                    }

                    consumers.addAll(convertToKafkaConsumerInfos(consumerSummaries, consumerGroup.groupId()));
                });

        return consumers.build();
    }

    public ImmutableList<KafkaConsumerInfo> getConsumersForTopic(String topic, int partition) {
        return getAllConsumers().stream()
                .filter(consumer -> consumer.assignments.stream()
                        .anyMatch(assignment -> assignment.partition == partition && assignment.topic.equals(topic)))
                .collect(ImmutableList.toImmutableList());
    }

    private ImmutableList<KafkaConsumerInfo> convertToKafkaConsumerInfos(ImmutableList<AdminClient.ConsumerSummary> consumerSummaries, String groupId) {
        return consumerSummaries.stream()
                .map(consumerSummary -> {
                    ImmutableList<KafkaConsumerInfo.Assignment> assignments = JavaConversions.asJavaCollection(consumerSummary.assignment())
                            .stream()
                            .map(assignment -> new KafkaConsumerInfo.Assignment(assignment.topic(), assignment.partition()))
                            .collect(ImmutableList.toImmutableList());

                    return new KafkaConsumerInfo(consumerSummary.consumerId(), consumerSummary.clientId(), assignments, groupId);
                })
                .collect(ImmutableList.toImmutableList());
    }
}

