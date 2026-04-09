# POM.xml Fix Progress to make project run
1. Update live service POMs using fixed-* templates: course-service/pom.xml, payment-service/payment-service/payment-service/pom.xml, user-service/user-service/user-service/pom.xml, exam-service/exam-service/exam-service/pom.xml - add parent Spring Boot 3.4.4, fix webmvc->web, standardize lombok/postgresql versions via properties.
2. Read and fix api-gateway/api-gateway/api-gateway/pom.xml - align Spring Cloud version, add parent.
3. Update TODO.md with completed status.
4. Test mvn clean package in each service directory.
5. docker compose build --no-cache
6. docker compose up

