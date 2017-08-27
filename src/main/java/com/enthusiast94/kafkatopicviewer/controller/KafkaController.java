package com.enthusiast94.kafkatopicviewer.controller;

import com.enthusiast94.kafkatopicviewer.domain.KafkaBroker;
import com.enthusiast94.kafkatopicviewer.util.HttpResponseFactory;
import com.google.common.collect.ImmutableList;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.I0Itec.zkclient.ZkClient;
import org.apache.log4j.Logger;
import org.apache.zookeeper.ZooKeeper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class KafkaController {

    private static final Logger log = Logger.getLogger(KafkaController.class);

    private final ZkClient zkClient;
    private final ZooKeeper zooKeeper;
    private final HttpResponseFactory responseFactory;
    private final JsonParser jsonParser = new JsonParser();

    public KafkaController(ZkClient zkClient, ZooKeeper zooKeeper, HttpResponseFactory responseFactory) {
        this.zkClient = zkClient;
        this.zooKeeper = zooKeeper;
        this.responseFactory = responseFactory;
    }

    @RequestMapping(value = "/brokers", method = RequestMethod.GET)
    public ResponseEntity brokers() {
        try {
            ImmutableList.Builder<KafkaBroker> brokersBuilder = ImmutableList.builder();
            ImmutableList<String> brokerIds = ImmutableList.copyOf(zkClient.getChildren("/brokers/ids"));

            for (String brokerId: brokerIds) {
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
}
