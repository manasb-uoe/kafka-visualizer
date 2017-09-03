## Kafka Visualizer
A web client for visualizing your Kafka cluster. Developed using **Spring Boot**, **Angular 4** and **Bootstrap 4**.

### How to build?
Run the folowing command on the parent maven module `kafka-visualizer`:

`$ mvn clean package`

The executable jar will be generated under the the `target` directory of `kafka-visualizer-rest` module.

### How to run?
Run the executable jar using the following command and then navigate to `localhost:4200` on your browser:

`$ java -jar .\kafka-visualizer-rest-1.0-SNAPSHOT.jar --zookeeper=hostname:port --kafka=hostname:port [--maxTopicMessagesCount=<number>]`

### Rest API endpoints
- **`/api/brokers`**: Returns a list of all brokers in the cluster.
- **`/api/topics`**: Returns a list of all topics in the cluster
- **`/api/consumers`**: Returns a list of all active consumers.
- **`/api/consumers/{topicName}/{partition}`**: Returns a list of active consumers for a certain topic-partition pair.
- **`/api/topics/{topicName}/{partition}`**: Returns a list of messages on a certain topic-partition pair.

### Screenshots 

![Screenshot](https://github.com/enthusiast94/kafka-visualizer/blob/master/screenshot.png)
