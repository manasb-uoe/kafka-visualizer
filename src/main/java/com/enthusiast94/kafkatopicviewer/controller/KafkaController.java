package com.enthusiast94.kafkatopicviewer.controller;

import com.enthusiast94.kafkatopicviewer.util.HttpResponseFactory;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.common.Node;
import org.apache.kafka.common.internals.Topic;
import org.apache.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Set;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class KafkaController {

    private static final Logger log = Logger.getLogger(KafkaController.class);
    private final AdminClient adminClient;
    private final HttpResponseFactory responseFactory;

    public KafkaController(AdminClient adminClient, HttpResponseFactory responseFactory) {
        this.adminClient = adminClient;
        this.responseFactory = responseFactory;
    }

    @RequestMapping(value = "/brokers", method = RequestMethod.GET)
    public ResponseEntity brokers() {
        try {
            Collection<Node> brokers = adminClient.describeCluster().nodes().get();
            return responseFactory.createOkResponse(brokers);
        } catch (Exception e) {
            log.error("Error responding to /api/brokers", e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
    }

    @RequestMapping(value = "/topics", method = RequestMethod.GET)
    public ResponseEntity topics() {
        try {
            Set<String> topics = adminClient.listTopics().names().get();
            return responseFactory.createOkResponse(topics);
        } catch (Exception e) {
            log.error("Error responding to /api/topics", e);
            return responseFactory.createInternalServerErrorResponse(e.getMessage());
        }
    }
}
