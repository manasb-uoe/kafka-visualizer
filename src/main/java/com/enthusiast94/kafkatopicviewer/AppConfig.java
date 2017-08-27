package com.enthusiast94.kafkatopicviewer;

import com.enthusiast94.kafkatopicviewer.config.Config;
import com.enthusiast94.kafkatopicviewer.config.ConfigLoader;
import com.enthusiast94.kafkatopicviewer.domain.DefectException;
import com.google.common.collect.ImmutableList;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

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
}
