FROM openjdk:12-jdk-alpine

RUN apk --update add nodejs

ARG app_jar=rest-@{project.version}.jar

COPY rest-@{project.version}.jar /

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/rest-@{project.version}.jar"]
