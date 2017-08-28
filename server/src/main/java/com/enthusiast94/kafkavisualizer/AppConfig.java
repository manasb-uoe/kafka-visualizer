package com.enthusiast94.kafkavisualizer;

import com.enthusiast94.kafkavisualizer.domain.CommandLineArgs;
import com.enthusiast94.kafkavisualizer.domain.kafka.KafkaConsumerWrapper;
import com.enthusiast94.kafkavisualizer.service.KafkaAdmin;
import com.enthusiast94.kafkavisualizer.service.KafkaTopicsDataTracker;
import com.enthusiast94.kafkavisualizer.util.HttpResponseFactory;
import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import kafka.admin.AdminClient;
import org.I0Itec.zkclient.ZkClient;
import org.apache.log4j.Logger;
import org.apache.zookeeper.ZooKeeper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.io.IOException;
import java.util.regex.Pattern;

@Configuration
public class AppConfig {

    private static Logger log = Logger.getLogger(AppConfig.class);

    @Bean
    public CommandLineArgs commandLineArgs(ApplicationArguments applicationArguments) {
        return new CommandLineArgs(applicationArguments.getSourceArgs());
    }

    @Bean
    public HttpResponseFactory httpResponseFactory() {
        return new HttpResponseFactory();
    }

    @Bean(destroyMethod = "close")
    public ZkClient zkClient(CommandLineArgs commandLineArgs) {
        return new ZkClient(commandLineArgs.zookeeperServers);
    }

    @Bean(destroyMethod = "close")
    public ZooKeeper zooKeeper(CommandLineArgs commandLineArgs) {
        try {
            return new ZooKeeper(commandLineArgs.zookeeperServers, Integer.MAX_VALUE, null);
        } catch (IOException e) {
            log.error("Error setting up Zookeeper", e);
            throw new DefectException(e);
        }
    }

    @Bean(destroyMethod = "close")
    public AdminClient adminClient(CommandLineArgs commandLineArgs) {
        return AdminClient.createSimplePlaintext(commandLineArgs.kafkaServers);
    }

    @Bean
    public KafkaAdmin kafkaAdmin(ZooKeeper zooKeeper, ZkClient zkClient, AdminClient adminClient) {
        return new KafkaAdmin(zkClient, zooKeeper, adminClient);
    }

    @Bean(destroyMethod = "close")
    public KafkaConsumerWrapper kafkaConsumerWrapper(CommandLineArgs commandLineArgs, KafkaAdmin kafkaAdmin) {
        return new KafkaConsumerWrapper(commandLineArgs.kafkaServers, kafkaAdmin.getAllTopics());
    }

    @Bean
    public KafkaTopicsDataTracker kafkaTopicsDataTracker(KafkaAdmin kafkaAdmin,
                                                         KafkaConsumerWrapper kafkaConsumerWrapper) {
        KafkaTopicsDataTracker kafkaTopicsDataTracker = new KafkaTopicsDataTracker(kafkaConsumerWrapper);
        kafkaTopicsDataTracker.start();
        return kafkaTopicsDataTracker;
    }
}
