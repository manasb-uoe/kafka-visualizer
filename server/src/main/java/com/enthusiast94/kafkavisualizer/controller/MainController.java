package com.enthusiast94.kafkavisualizer.controller;

import com.enthusiast94.kafkavisualizer.service.KafkaAdmin;
import com.enthusiast94.kafkavisualizer.service.KafkaTopicsDataTracker;
import com.enthusiast94.kafkavisualizer.util.HttpResponseFactory;
import org.apache.kafka.common.TopicPartition;
import org.springframework.http.MediaType;

import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Named
@Path("/api")
@Produces(MediaType.APPLICATION_JSON_VALUE)
public class MainController {

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

    @GET
    @Path("brokers")
    public Response brokers() {
        try {
            return responseFactory.createOkResponse(kafkaAdmin.getAllBrokers());
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    @GET
    @Path("topics")
    public Response topics() {
        try {
            return responseFactory.createOkResponse(kafkaAdmin.getAllTopics());
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    @GET
    @Path("/consumers")
    public Response consumers() {
        try {
            return responseFactory.createOkResponse(kafkaAdmin.getAllConsumers());
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    @GET
    @Path("/consumers/{topicName}/{partition}")
    public Response consumersForTopic(@PathParam("topicName") String topicName, @PathParam("partition") int partition) {
        try {
            if (!doesTopicAndPartitionExist(topicName, partition)) {
                return responseFactory.create404ErrorResponse(String.format("No (topic, partition) pair found for " +
                        "[(%s, %s)]", topicName, partition));
            }

            return responseFactory.createOkResponse(kafkaAdmin.getConsumersForTopic(topicName, partition));
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    @GET
    @Path("/topics/{topicName}/{partition}")
    public Response topicData(@PathParam("topicName") String topicName, @PathParam("partition") int partition) {
        try {
            if (!doesTopicAndPartitionExist(topicName, partition)) {
                return responseFactory.create404ErrorResponse(String.format("No (topic, partition) pair found for " +
                        "[(%s, %s)]", topicName, partition));
            }

            return responseFactory.createOkResponse(kafkaTopicsDataTracker.getRecords(new TopicPartition(topicName, partition)));
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    private boolean doesTopicAndPartitionExist(String topicName, int partition) {
        return kafkaAdmin.getAllTopics().stream()
                .anyMatch(topic -> topic.name.equals(topicName) && partition < topic.numPartitions);
    }
}