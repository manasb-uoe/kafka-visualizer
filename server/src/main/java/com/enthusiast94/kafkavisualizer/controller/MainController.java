package com.enthusiast94.kafkavisualizer.controller;

import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaTopic;
import com.enthusiast94.kafkavisualizer.service.KafkaAdmin;
import com.enthusiast94.kafkavisualizer.service.KafkaTopicsDataTracker;
import com.enthusiast94.kafkavisualizer.util.HttpResponseFactory;
import com.google.common.collect.ImmutableList;
import org.apache.kafka.common.TopicPartition;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class MainController {

    private static final Logger log = Logger.getLogger(MainController.class);

    private final KafkaAdmin kafkaAdmin;
    private final KafkaTopicsDataTracker kafkaTopicsDataTracker;
    private final HttpResponseFactory responseFactory;

    public MainController(KafkaAdmin kafkaAdmin,
                          KafkaTopicsDataTracker kafkaTopicsDataTracker,
                          HttpResponseFactory responseFactory) {
        this.kafkaAdmin = kafkaAdmin;
        this.kafkaTopicsDataTracker = kafkaTopicsDataTracker;
        this.responseFactory = responseFactory;
    }

    @RequestMapping(value = "/brokers", method = RequestMethod.GET)
    public ResponseEntity brokers() {
        try {
            return responseFactory.createOkResponse(kafkaAdmin.getAllBrokers());
        } catch (Exception e) {
            log.error("Error responding to /api/brokers", e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
    }

    @RequestMapping(value = "/topics", method = RequestMethod.GET)
    public ResponseEntity topics() {
        try {
            return responseFactory.createOkResponse(kafkaAdmin.getAllTopics());
        } catch (Exception e) {
            log.error("Error responding to /api/topics", e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
    }

    @RequestMapping(value = "/consumer-groups", method = RequestMethod.GET)
    public ResponseEntity consumerGroups() {
        try {

            return responseFactory.createOkResponse(kafkaAdmin.getAllConsumerGroups());
        } catch (Exception e) {
            log.error("Error responding to /api/consumer-groups", e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
    }

    @RequestMapping(value = "/topics/{topicName}/{partition}", method = RequestMethod.GET)
    public ResponseEntity topicData(@PathVariable("topicName") String topicName,
                                    @PathVariable("partition") int partition,
                                    @Value("kafka") String kafkaServersString) {
        try {
            ImmutableList<KafkaTopic> allTopics = kafkaAdmin.getAllTopics();

            if (!doesTopicAndPartitionExist(topicName, partition, allTopics)) {
                return responseFactory.create404ErrorResponse(String.format("No (topic, partition) pair found for " +
                        "[(%s, %s)]", topicName, partition));
            }

            return responseFactory.createOkResponse(kafkaTopicsDataTracker.getRecords(new TopicPartition(topicName, partition)));
        } catch (Exception e) {
            log.error("Error responding to /api/topics/" + topicName + "/" + partition, e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
    }

    private boolean doesTopicAndPartitionExist(String topicName, int partition, ImmutableList<KafkaTopic> allTopics) {
        return allTopics.stream().anyMatch(topic -> topic.name.equals(topicName) && partition < topic.numPartitions);
    }
}