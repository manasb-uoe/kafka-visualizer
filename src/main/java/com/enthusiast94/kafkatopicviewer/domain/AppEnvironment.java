package com.enthusiast94.kafkatopicviewer.domain;

import com.enthusiast94.kafkatopicviewer.util.exception.DefectException;

import java.util.Arrays;
import java.util.Optional;

public enum AppEnvironment {
    DEV, PROD;

    public static AppEnvironment getFromString(String environmentString) {
        Optional<AppEnvironment> appEnvironment = Arrays.stream(values())
                .filter(env -> env.name().toLowerCase().equals(environmentString.toLowerCase()))
                .findFirst();

        if (!appEnvironment.isPresent()) {
            throw new DefectException(String.format("Failed to find app environment with name [%s]", environmentString));
        }

        return appEnvironment.get();
    }
}
