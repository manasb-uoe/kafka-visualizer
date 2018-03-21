package com.enthusiast94.kafkavisualizer.api;

import com.enthusiast94.kafkavisualizer.domain.AppEnvironment;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaBroker;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaTopic;
import com.enthusiast94.kafkavisualizer.service.*;
import com.enthusiast94.kafkavisualizer.util.HttpResponseFactory;
import com.google.common.base.Splitter;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import javafx.util.Pair;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.springframework.http.MediaType;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Path("/")
@Produces(MediaType.APPLICATION_JSON_VALUE)
public class RestResource {

    private final AppEnvironment environment;
    private final HttpResponseFactory responseFactory;
    private final KafkaProducerWrapper kafkaProducerWrapper;
    private final KafkaBrokersTracker kafkaBrokersTracker;
    private final KafkaTopicsTracker kafkaTopicsTracker;
    private final KafkaTopicsDataTracker kafkaTopicsDataTracker;
    private final KafkaUtils kafkaUtils;

    public RestResource(AppEnvironment environment,
                        HttpResponseFactory responseFactory,
                        KafkaProducerWrapper kafkaProducerWrapper,
                        KafkaBrokersTracker kafkaBrokersTracker,
                        KafkaTopicsTracker kafkaTopicsTracker,
                        KafkaTopicsDataTracker kafkaTopicsDataTracker, KafkaUtils kafkaUtils) {
        this.environment = environment;
        this.responseFactory = responseFactory;
        this.kafkaProducerWrapper = kafkaProducerWrapper;
        this.kafkaBrokersTracker = kafkaBrokersTracker;
        this.kafkaTopicsTracker = kafkaTopicsTracker;
        this.kafkaTopicsDataTracker = kafkaTopicsDataTracker;
        this.kafkaUtils = kafkaUtils;
    }

    @GET
    @Path("/environment")
    public Response environment() {
        return responseFactory.createOkResponse(environment.toString());
    }

    @GET
    @Path("/brokers")
    public Response brokers(@QueryParam("version") long version) {
        var brokers = kafkaBrokersTracker.getBrokers(version);
        if (brokers.isPresent()) {
            return responseFactory.createOkResponse(brokers.get());
        } else {
            return responseFactory.createNotModifiedResponse();
        }
    }

    @GET
    @Path("/topics")
    public Response topics(@QueryParam("version") long version) {
        var topics = kafkaTopicsTracker.getTopics(version);
        if (topics.isPresent()) {
            return responseFactory.createOkResponse(topics.get());
        } else {
            return responseFactory.createNotModifiedResponse();
        }
    }

    @GET
    @Path("/consumers")
    public Response consumers() {
        try {
            return responseFactory.createOkResponse(kafkaUtils.getAllConsumers());
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    @GET
    @Path("/consumers/{topicName}/{partition}")
    public Response consumersForTopic(@PathParam("topicName") String topicName, @PathParam("partition") int partition) {
        try {
            if (!doesTopicAndPartitionExist(topicName, partition)) {
                return responseFactory.createNotFoundResponse(String.format("No (topic, partition) pair found for " +
                        "[(%s, %s)]", topicName, partition));
            }

            return responseFactory.createOkResponse(kafkaUtils.getConsumersForTopic(topicName, partition));
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    @GET
    @Path("/topics/{topicName}/{partition}")
    public Response topicData(@PathParam("topicName") String topicName,
                              @PathParam("partition") int partition,
                              @QueryParam("version") long version,
                              @QueryParam("query") String query) {
        try {
            var records =
                    kafkaTopicsDataTracker.getRecords(new TopicPartition(topicName, partition), version, query);
            if (!records.isPresent()) {
                return responseFactory.createNotModifiedResponse();
            }

            return responseFactory.createOkResponse(records.get());
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    @POST
    @Path("/topics/{topicName}")
    public Response postTopicData(@PathParam("topicName") String topicName,
                                  String data) {
        try {
            var keyValuePair = parseKeyValuePair(data);

            if (!doesTopicExist(topicName)) {
                return responseFactory.createNotFoundResponse(String.format("No topic exists with the name [%s]", topicName));
            }

            var metadata = kafkaProducerWrapper.publish(keyValuePair.getKey(), keyValuePair.getValue(), topicName);
            return responseFactory.createOkResponse(metadata);
        } catch (Exception e) {
            return responseFactory.createServerErrorResponse(e);
        }
    }

    private boolean doesTopicAndPartitionExist(String topicName, int partition) {
        return kafkaUtils.getAllTopics().stream()
                .anyMatch(topic -> topic.name.equals(topicName) && partition < topic.numPartitions);
    }

    private boolean doesTopicExist(String topicName) {
        return kafkaUtils.getAllTopics().stream()
                .anyMatch(topic -> topic.name.equals(topicName));
    }

    private Pair<String, String> parseKeyValuePair(String input) throws UnsupportedEncodingException {
        input = URLDecoder.decode(input, "utf8");
        if (input.startsWith("?")) {
            input = input.substring(1);
        }

        Matcher matcher = Pattern.compile("key=(.*)&value=(.*)", Pattern.DOTALL).matcher(input);
        if (!matcher.find()){
            throw new IllegalArgumentException("no key/value params found in the posted body");
        }

        return new Pair<>(matcher.group(1), matcher.group(2));
    }
}