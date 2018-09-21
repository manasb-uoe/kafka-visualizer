#!/usr/bin/env bash
java --add-modules java.activation -jar kafkavisualizer/rest/target/rest-1.0-SNAPSHOT.jar --zookeeper=$1 --kafka=$2 --env=$3
