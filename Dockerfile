FROM openjdk:12-jdk-alpine

RUN apt-get update
RUN apk add --update npm
