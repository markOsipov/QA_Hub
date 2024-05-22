FROM gradle:8.1 as builder

COPY . /home/gradle/src
WORKDIR /home/gradle/src

RUN gradle clean bootJar

FROM openjdk:11

RUN mkdir /app
COPY --from=builder /home/gradle/src/build/libs/*.jar /app/app.jar
WORKDIR /app

RUN mkdir /var/log/qa_hub
RUN chmod -R 777 /var/log/qa_hub
RUN env

EXPOSE 8080

ENTRYPOINT ["java", \
            "-Denvironment=${ENV_MONGO_QA_HUB_HOST}", \
            "-Denvironment=${ENV_MONGO_QA_HUB_LOGIN}", \
            "-Denvironment=${ENV_MONGO_QA_HUB_PASSWORD}", \
            "-jar", \
            "/app/app.jar"]
