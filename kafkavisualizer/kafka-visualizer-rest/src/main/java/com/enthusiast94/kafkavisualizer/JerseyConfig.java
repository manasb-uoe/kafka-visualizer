package com.enthusiast94.kafkavisualizer;

import com.enthusiast94.kafkavisualizer.api.MainResource;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.context.annotation.Configuration;

import javax.ws.rs.ApplicationPath;

@Configuration
@ApplicationPath("/api")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig(MainResource mainResource) {
        register(mainResource);
    }
}
