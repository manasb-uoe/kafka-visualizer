# Kafka Visualizer
A web client for visualizing your Kafka cluster. Developed using **Spring Boot**, **Angular 4** and **Bootstrap 4**.

## How to build?
Run the folowing command on the parent maven module `kafka-visualizer`:

`$ mvn clean package`

The executable jar will be generated under the the `target` directory of `kafka-visualizer-rest` module.

> Requirement: JDK 8 with JavaFX 

## How to run?
Run the executable jar using the following command and then navigate to `localhost:8080` on your browser:

`$ java -jar .\kafka-visualizer-rest-1.0-SNAPSHOT.jar --zookeeper=hostname:port --kafka=hostname:port -env=<DEV,QA,UAT or PROD> [--maxTopicMessagesCount=<number>]`

## Rest API endpoints
- **`GET /api/brokers`**: Returns a list of all brokers in the cluster.
- **`GET /api/topics`**: Returns a list of all topics in the cluster
- **`GET /api/consumers`**: Returns a list of all active consumers.
- **`GET /api/consumers/{topicName}/{partition}`**: Returns a list of active consumers for a certain topic-partition pair.
- **`GET /api/topics/{topicName}/{partition}`**: Returns a list of messages on a certain topic-partition pair.
- **`POST /api/topics/{topicName}`**: Publishes URL form encoded message with a `key` and a `value` (eg: key=1&value=a) to a certain topic. 

## Screenshots 

![Screenshot](https://github.com/enthusiast94/kafka-visualizer/blob/master/screenshot_1.png)
