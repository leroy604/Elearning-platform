# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.m2,id=user-service mvn clean package -Dmaven.test.skip=true -e -X

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

