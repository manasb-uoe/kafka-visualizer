package com.enthusiast94.kafkatopicviewer.controller;

import com.enthusiast94.kafkatopicviewer.domain.KafkaBroker;
import com.enthusiast94.kafkatopicviewer.domain.KafkaConsumerInfo;
import com.enthusiast94.kafkatopicviewer.util.HttpResponseFactory;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import kafka.admin.AdminClient;
import kafka.coordinator.group.GroupOverview;
import org.I0Itec.zkclient.ZkClient;
import org.apache.log4j.Logger;
import org.apache.zookeeper.ZooKeeper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import scala.collection.JavaConversions;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class KafkaController {

    private static final Logger log = Logger.getLogger(KafkaController.class);

    private final ZkClient zkClient;
    private final ZooKeeper zooKeeper;
    private final AdminClient adminClient;
    private final HttpResponseFactory responseFactory;
    private final JsonParser jsonParser = new JsonParser();

    public KafkaController(ZkClient zkClient,
                           ZooKeeper zooKeeper,
                           AdminClient adminClient,
                           HttpResponseFactory responseFactory) {
        this.zkClient = zkClient;
        this.zooKeeper = zooKeeper;
        this.adminClient = adminClient;
        this.responseFactory = responseFactory;
    }

    @RequestMapping(value = "/brokers", method = RequestMethod.GET)
    public ResponseEntity brokers() {
        try {
            ImmutableList.Builder<KafkaBroker> brokersBuilder = ImmutableList.builder();
            ImmutableList<String> brokerIds = ImmutableList.copyOf(zkClient.getChildren("/brokers/ids"));

            for (String brokerId : brokerIds) {
                String jsonString = new String(zooKeeper.getData("/brokers/ids/" + brokerId, false, null));
                JsonObject json = jsonParser.parse(jsonString).getAsJsonObject();
                KafkaBroker broker = new KafkaBroker(json.get("host").getAsString(), json.get("port").getAsInt());
                brokersBuilder.add(broker);
            }

            return responseFactory.createOkResponse(brokersBuilder.build());
        } catch (Exception e) {
            log.error("Error responding to /api/brokers", e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
    }

    @RequestMapping(value = "/topics", method = RequestMethod.GET)
    public ResponseEntity topics() {
        try {
            ImmutableList<String> topics = ImmutableList.copyOf(zkClient.getChildren("/brokers/topics"));
            return responseFactory.createOkResponse(topics);
        } catch (Exception e) {
            log.error("Error responding to /api/topics", e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
    }

    @RequestMapping(value = "/consumer-groups", method = RequestMethod.GET)
    public ResponseEntity consumerGroups() {
        try {
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
            return responseFactory.createOkResponse(consumersMapBuilder.build());
        } catch (Exception e) {
            log.error("Error responding to /api/consumer-groups", e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
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