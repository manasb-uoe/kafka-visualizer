package com.enthusiast94.kafkavisualizer.domain;

import com.enthusiast94.kafkavisualizer.util.exception.DefectException;

import java.util.Arrays;
import java.util.regex.Pattern;

public class CommandLineArgs {

    public final AppEnvironment environment;
    public final String kafkaServers;
    public final String zookeeperServers;
    public final MaxTopicMessageCount maxTopicMessagesCount;

    public CommandLineArgs(String[] args) {
        //TODO Use some standard library to parse command line args
        //TODO The 'env' arg seems meaningless
        if (args.length < 3) {
            throw new DefectException(String.format("The following command line arguments are required: --env=%s, " +
                    "--zookeeper=host:port and --kafka=host:port", Arrays.toString(AppEnvironment.values())));
        }

        var argsString = String.join(" ", args);

        var envMatcher = Pattern.compile("--env=(\\w*)").matcher(argsString);
        if (!envMatcher.find()) {
            throw new DefectException(String.format("Incorrect app environment format! The format must be [%s]",
                    envMatcher.pattern().toString()));
        } else {
            environment = AppEnvironment.fromString(envMatcher.group(1));
        }

        var kafkaMatcher = Pattern.compile("--kafka=([^\\s,]+:[0-9]+(,[^\\s,]+:[0-9]+)*)").matcher(argsString);
        if (!kafkaMatcher.find()) {
            throw new DefectException(String.format("Incorrect kafka servers format! The format must be [%s]",
                    kafkaMatcher.pattern().toString()));
        }

        kafkaServers = kafkaMatcher.group(1);

        var zookeeperMatcher = Pattern.compile("--zookeeper=([^\\s,]+:[0-9]+(,[^\\s,]+:[0-9]+)*)").matcher(argsString);
        if (!zookeeperMatcher.find()) {
            throw new DefectException(String.format("Incorrect zookeeper servers format! The format must be [%s]",
                    kafkaMatcher.pattern().toString()));
        }

        zookeeperServers = zookeeperMatcher.group(1);

        var maxTopicMessagesCountMatcher = Pattern.compile("--maxTopicMessagesCount=([0-9]+)").matcher(argsString);
        if (!maxTopicMessagesCountMatcher.find()) {
            maxTopicMessagesCount = MaxTopicMessageCount.EMPTY;
        } else {
            maxTopicMessagesCount = new MaxTopicMessageCount(Integer.parseInt(maxTopicMessagesCountMatcher.group(1)));
        }
    }
}
