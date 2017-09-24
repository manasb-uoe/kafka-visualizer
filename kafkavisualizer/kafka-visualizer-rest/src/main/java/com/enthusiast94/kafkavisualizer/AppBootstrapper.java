package com.enthusiast94.kafkavisualizer;

import com.enthusiast94.kafkavisualizer.domain.CommandLineArgs;
import com.enthusiast94.kafkavisualizer.service.*;
import com.enthusiast94.kafkavisualizer.util.HttpResponseFactory;
import kafka.admin.AdminClient;
import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.exception.ZkMarshallingError;
import org.I0Itec.zkclient.serialize.ZkSerializer;
import org.springframework.boot.ApplicationArguments;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class AppBootstrapper {

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
        ZkClient zkClient = new ZkClient(commandLineArgs.zookeeperServers, 10000, 10000,
                new ZkSerializer() {
                    @Override
                    public byte[] serialize(Object data) throws ZkMarshallingError {
                        return String.valueOf(data).getBytes();
                    }

                    @Override
                    public Object deserialize(byte[] bytes) throws ZkMarshallingError {
                        return new String(bytes);
                    }
                });
        zkClient.waitUntilConnected(10, TimeUnit.SECONDS);
        return zkClient;
    }

    @Bean(destroyMethod = "close")
    public AdminClient adminClient(CommandLineArgs commandLineArgs) {
        return AdminClient.createSimplePlaintext(commandLineArgs.kafkaServers);
    }

    @Bean
    public KafkaUtils kafkaAdmin(ZkClient zkClient, AdminClient adminClient) {
        return new KafkaUtils(zkClient, adminClient);
    }

    @Bean(destroyMethod = "close")
    public KafkaAllTopicsConsumer kafkaConsumerWrapper(CommandLineArgs commandLineArgs) {
        return new KafkaAllTopicsConsumer(commandLineArgs.kafkaServers);
    }

    @Bean(destroyMethod = "close")
    public KafkaProducerWrapper kafkaProducerWrapper(CommandLineArgs commandLineArgs) {
        return new KafkaProducerWrapper(commandLineArgs.kafkaServers);
    }

    @Bean
    public KafkaTopicsDataTracker kafkaTopicsDataTracker(KafkaAllTopicsConsumer kafkaAllTopicsConsumer,
                                                         CommandLineArgs commandLineArgs) {
        KafkaTopicsDataTracker kafkaTopicsDataTracker =
                new KafkaTopicsDataTracker(kafkaAllTopicsConsumer, commandLineArgs.maxTopicMessagesCount);
        kafkaTopicsDataTracker.start();
        return kafkaTopicsDataTracker;
    }

    @Bean(destroyMethod = "close")
    public KafkaBrokersTracker kafkaBrokersTracker(ZkClient zkClient) {
        KafkaBrokersTracker kafkaBrokersTracker = new KafkaBrokersTracker(zkClient);
        kafkaBrokersTracker.start();
        return kafkaBrokersTracker;
    }

    @Bean(destroyMethod = "close")
    public KafkaTopicsTracker kafkaTopicsTracker(ZkClient zkClient) {
        KafkaTopicsTracker kafkaTopicsTracker = new KafkaTopicsTracker(zkClient);
        kafkaTopicsTracker.start();
        return kafkaTopicsTracker;
    }
}