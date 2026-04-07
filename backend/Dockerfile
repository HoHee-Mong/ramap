# 빌드 스테이지
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Gradle Wrapper와 설정 파일만 먼저 복사 (레이어 캐싱 활용)
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# gradle.properties의 org.gradle.jvmargs가 JAVA_TOOL_OPTIONS보다 우선 적용됨
COPY gradle.properties .

# 의존성 다운로드 (env -u로 JAVA_TOOL_OPTIONS를 프로세스 수준에서 제거)
RUN chmod +x gradlew && env -u JAVA_TOOL_OPTIONS ./gradlew dependencies --no-daemon

# 소스 복사 후 빌드
COPY src src
RUN env -u JAVA_TOOL_OPTIONS ./gradlew bootJar --no-daemon

# 실행 스테이지
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
