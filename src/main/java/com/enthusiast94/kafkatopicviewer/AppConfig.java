package com.enthusiast94.kafkatopicviewer;

import com.enthusiast94.kafkatopicviewer.config.Config;
import com.enthusiast94.kafkatopicviewer.config.ConfigLoader;
import com.enthusiast94.kafkatopicviewer.domain.DefectException;
import com.enthusiast94.kafkatopicviewer.util.HttpResponseFactory;
import kafka.admin.AdminClient;
import org.I0Itec.zkclient.ZkClient;
import org.apache.log4j.Logger;
import org.apache.zookeeper.ZooKeeper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Properties;
import java.util.stream.Collectors;

@Configuration
public class AppConfig {

    private static Logger log = Logger.getLogger(AppConfig.class);

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
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

    @Bean
    public Config config(@Value("${config}") String configFilePathString) {
        try {
            Path configFilePath = Paths.get(getClass().getResource(configFilePathString).toURI());
            ConfigLoader configLoader = new ConfigLoader(configFilePath);
            return configLoader.load();
        } catch (URISyntaxException e) {
            throw new DefectException(e);
        }
    }

    @Bean(destroyMethod = "close")
    public AdminClient adminClient(Config config) {
        Properties properties = new Properties();
        properties.put("bootstrap.servers", config.kafkaBrokers.stream()
                .map(kafkaBroker -> kafkaBroker.hostname + ":" + kafkaBroker.port)
                .collect(Collectors.joining(",")));
        return AdminClient.create(properties);
    }

    @Bean
    public HttpResponseFactory httpResponseFactory() {
        return new HttpResponseFactory();
    }

    @Bean
    public ZkClient zkClient(Config config) {
        String serversString = getZookeeperServersString(config);
        return new ZkClient(serversString);
    }

    @Bean
    public ZooKeeper zooKeeper(Config config) {
        try {
            return new ZooKeeper(getZookeeperServersString(config), Integer.MAX_VALUE, null);
        } catch (IOException e) {
            log.error("Error setting up Zookeeper", e);
            throw new DefectException(e);
        }
    }

    private String getZookeeperServersString(Config config) {
        return config.zookeeperNodes.stream()
                .map(kafkaBroker -> kafkaBroker.hostname + ":" + kafkaBroker.port)
                .collect(Collectors.joining(","));
    }
}
