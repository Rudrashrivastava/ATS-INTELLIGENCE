# Stage 1: Build stage using Maven and JDK 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and source code to build package
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine
LABEL author="Rudra Shrivastava"
LABEL maintainer="rudrashrivastava45@gmail.com"

WORKDIR /app

# Copy compiled JAR from build stage
COPY --from=build /app/target/analyzer-0.0.1-SNAPSHOT.jar app.jar

# Expose backend port
EXPOSE 8081

# Execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]
