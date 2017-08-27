package com.enthusiast94.kafkatopicviewer.config;

import com.enthusiast94.kafkatopicviewer.domain.AppEnvironment;
import com.enthusiast94.kafkatopicviewer.domain.DefectException;
import com.enthusiast94.kafkatopicviewer.util.ImmutableListGsonDeserializer;
import com.google.common.collect.ImmutableList;
import com.google.gson.*;
import org.apache.log4j.Logger;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ConfigLoader {

    private static Logger log = Logger.getLogger(ConfigLoader.class);

    private Path configFilePath;
    private Gson gson = new GsonBuilder()
            .registerTypeAdapter(ImmutableList.class, new ImmutableListGsonDeserializer())
            .create();

    public ConfigLoader(Path configFilePath) {
        this.configFilePath = configFilePath;
    }

    public Config load() {
        try {
            String jsonString = new String(Files.readAllBytes(configFilePath));
            return gson.fromJson(jsonString, Config.class);
        } catch (Exception e) {
            log.error(String.format("Failed to read config file [%s]", configFilePath), e);
            throw new DefectException(e);
        }
    }
}
