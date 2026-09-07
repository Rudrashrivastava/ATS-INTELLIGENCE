# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend with React Static Assets
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Copy compiled frontend dist to Spring Boot static resources folder
COPY --from=frontend-build /frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Runtime stage
FROM eclipse-temurin:17-jre-alpine
LABEL author="Rudra Shrivastava"
LABEL maintainer="rudrashrivastava45@gmail.com"

WORKDIR /app

# Copy compiled JAR from build stage
COPY --from=build /app/target/analyzer-0.0.1-SNAPSHOT.jar app.jar

# Expose application port
EXPOSE 8081

# Execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]
