package com.enthusiast94.kafkavisualizer.domain;

import com.enthusiast94.kafkavisualizer.util.exception.DefectException;
import com.google.common.base.Joiner;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class CommandLineArgs {

    public final String kafkaServers;
    public final String zookeeperServers;

    public CommandLineArgs(String[] args) {
        if (args.length < 2) {
            throw new DefectException("The following command line arguments are required: [--zookeeper=host:port] " +
                    "and [--kafka=host:port]");
        }

        String argsString = Arrays.stream(args).collect(Collectors.joining(" "));

        Matcher kafkaMatcher = Pattern.compile("--kafka=([^\\s,]+:[0-9]+(,[^\\s,]+:[0-9]+)*)").matcher(argsString);
        if (!kafkaMatcher.find()) {
            throw new DefectException(String.format("Incorrect kafka servers format! The format must be [%s]",
                    kafkaMatcher.pattern().toString()));
        }

        kafkaServers = kafkaMatcher.group(1);

        Matcher zookeeperMatcher = Pattern.compile("--zookeeper=([^\\s,]+:[0-9]+(,[^\\s,]+:[0-9]+)*)").matcher(argsString);
        if (!zookeeperMatcher.find()) {
            throw new DefectException(String.format("Incorrect zookeeper servers format! The format must be [%s]",
                    kafkaMatcher.pattern().toString()));
        }

        zookeeperServers = zookeeperMatcher.group(1);
    }
}
