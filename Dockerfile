FROM ubuntu

RUN apt-get update
RUN apt-get install -y software-properties-common curl
RUN add-apt-repository -y ppa:linuxuprising/java
RUN apt-get update
RUN echo oracle-java10-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get install -y oracle-java10-installer maven
RUN apt install oracle-java10-set-default
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

COPY kafkavisualizer /opt/kafkavisualizer/
RUN ls -la /opt

WORKDIR /opt/kafkavisualizer/
RUN mvn package

RUN ["chmod", "+x", "/opt/kafkavisualizer/file.sh"]

ENTRYPOINT ["/opt/kafkavisualizer/file.sh"]
CMD []
