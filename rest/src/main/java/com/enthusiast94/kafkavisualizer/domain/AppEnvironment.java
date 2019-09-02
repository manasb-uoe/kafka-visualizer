package com.enthusiast94.kafkavisualizer.domain;

import com.enthusiast94.kafkavisualizer.util.exception.DefectException;

import java.util.Arrays;

public enum AppEnvironment {
    DEV, QA, UAT, PROD;

    public static AppEnvironment fromString(String environmentString) {
        return Arrays.stream(values())
                .filter(env -> env.name().toLowerCase().equals(environmentString.toLowerCase()))
                .findFirst()
                .orElseThrow(() -> new DefectException(String.format("Failed to find app environment with name [%s]." +
                        " Allowed values are [%s].", environmentString, Arrays.toString(values()))));
    }
}
