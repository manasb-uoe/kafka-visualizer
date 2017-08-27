package com.enthusiast94.kafkatopicviewer;

import com.enthusiast94.kafkatopicviewer.domain.DefectException;
import com.enthusiast94.kafkatopicviewer.util.HttpResponseFactory;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Maps;
import com.sun.org.apache.xpath.internal.operations.Bool;
import joptsimple.util.RegexMatcher;
import org.I0Itec.zkclient.ZkClient;
import org.apache.log4j.Logger;
import org.apache.zookeeper.ZooKeeper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class AppConfig {

    private static Logger log = Logger.getLogger(AppConfig.class);

    @Bean
    @Order(1)
    public CommandLineRunner validateCommandLineArgs() {
        return args -> {
            if (args.length < 2) {
                throw new DefectException("The following command line arguments are required: [--zookeeper=host:port] " +
                        "and [--kafka=host:port]");
            }

            Pattern zookeeperPattern = Pattern.compile("--zookeeper=.+:[0-9]+(,.+:[0-9]+)*");
            Pattern kafkaPattern = Pattern.compile("--kafka=.+:[0-9]+(,.+:[0-9]+)*");
            boolean isZookeeperProvided = false;
            boolean isKafkaProvided = false;

            for (String arg : args) {
                if (!isZookeeperProvided) {
                    isZookeeperProvided = zookeeperPattern.matcher(arg).matches();
                }
                if (!isKafkaProvided) {
                    isKafkaProvided = kafkaPattern.matcher(arg).matches();
                }
            }

            if (!isZookeeperProvided || !isKafkaProvided) {
                throw new DefectException("Incorrect format of required command line arguments! The format " +
                        "must be: [" + zookeeperPattern.pattern() + "] [" + kafkaPattern.pattern() + "]");
            }
        };
    }

    @Bean
    @Order(2)
    public CommandLineRunner logSpringBootProvidedBeans(ApplicationContext ctx) {
        return args -> {
            log.info("Let's inspect the beans provided by Spring Boot:");

            log.info("-----------------------------------------------");
            String[] beanNames = ctx.getBeanDefinitionNames();
            Arrays.sort(beanNames);
            for (String beanName : beanNames) {
                log.info(beanName);
            }
            log.info("-----------------------------------------------");
        };
    }

//    @Bean(destroyMethod = "close")
//    public AdminClient adminClient(Config config) {
//        Properties properties = new Properties();
//        properties.put("bootstrap.servers", config.kafkaBrokers.stream()
//                .map(kafkaBroker -> kafkaBroker.hostname + ":" + kafkaBroker.port)
//                .collect(Collectors.joining(",")));
//        return AdminClient.create(properties);
//    }

    @Bean
    public HttpResponseFactory httpResponseFactory() {
        return new HttpResponseFactory();
    }

    @Bean(destroyMethod = "close")
    public ZkClient zkClient(@Value("${zookeeper}") String zookeeperServersString) {
        return new ZkClient(zookeeperServersString);
    }

    @Bean(destroyMethod = "close")
    public ZooKeeper zooKeeper(@Value("${zookeeper}") String zookeeperServersString) {
        try {
            return new ZooKeeper(zookeeperServersString, Integer.MAX_VALUE, null);
        } catch (IOException e) {
            log.error("Error setting up Zookeeper", e);
            throw new DefectException(e);
        }
    }
}
