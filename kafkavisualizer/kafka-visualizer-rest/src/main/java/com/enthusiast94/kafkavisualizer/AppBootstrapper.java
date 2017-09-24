package com.enthusiast94.kafkavisualizer;

import com.enthusiast94.kafkavisualizer.domain.CommandLineArgs;
import com.enthusiast94.kafkavisualizer.service.KafkaAdmin;
import com.enthusiast94.kafkavisualizer.service.KafkaBrokersTracker;
import com.enthusiast94.kafkavisualizer.service.KafkaProducerWrapper;
import com.enthusiast94.kafkavisualizer.service.KafkaTopicsTracker;
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
        ZkClient zkClient = new ZkClient(commandLineArgs.zookeeperServers, 10000, 10000, new ZkSerializer() {
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

//    @Bean(destroyMethod = "close")
//    public ZooKeeper zooKeeper(CommandLineArgs commandLineArgs) {
//        try {
//            return new ZooKeeper(commandLineArgs.zookeeperServers, 10000, null);
//        } catch (IOException e) {
//            throw new DefectException(e);
//        }
//    }

    @Bean(destroyMethod = "close")
    public AdminClient adminClient(CommandLineArgs commandLineArgs) {
        return AdminClient.createSimplePlaintext(commandLineArgs.kafkaServers);
    }

    @Bean
    public KafkaAdmin kafkaAdmin(ZkClient zkClient, AdminClient adminClient) {
        return new KafkaAdmin(zkClient, adminClient);
    }

//    @Bean(destroyMethod = "close")
//    public KafkaConsumerWrapper kafkaConsumerWrapper(CommandLineArgs commandLineArgs, KafkaAdmin kafkaAdmin) {
//        return new KafkaConsumerWrapper(commandLineArgs.kafkaServers, kafkaAdmin.getAllTopics());
//    }

    @Bean(destroyMethod = "close")
    public KafkaProducerWrapper kafkaProducerWrapper(CommandLineArgs commandLineArgs) {
        return new KafkaProducerWrapper(commandLineArgs.kafkaServers);
    }

//    @Bean
//    public KafkaTopicsDataTracker kafkaTopicsDataTracker(KafkaConsumerWrapper kafkaConsumerWrapper,
//                                                         CommandLineArgs commandLineArgs) {
//        KafkaTopicsDataTracker kafkaTopicsDataTracker =
//                new KafkaTopicsDataTracker(kafkaConsumerWrapper, commandLineArgs.maxTopicMessagesCount);
//        kafkaTopicsDataTracker.start();
//        return kafkaTopicsDataTracker;
//    }

    @Bean(destroyMethod = "close")
    public KafkaBrokersTracker kafkaBrokersTracker(ZkClient zkClient, KafkaAdmin kafkaAdmin) {
        KafkaBrokersTracker kafkaBrokersTracker = new KafkaBrokersTracker(zkClient);
        kafkaBrokersTracker.start();
        return kafkaBrokersTracker;
    }

    @Bean(destroyMethod = "close")
    public KafkaTopicsTracker kafkaTopicsTracker(ZkClient zkClient, KafkaAdmin kafkaAdmin) {
        KafkaTopicsTracker kafkaTopicsTracker = new KafkaTopicsTracker(zkClient);
        kafkaTopicsTracker.start();
        return kafkaTopicsTracker;
    }
}