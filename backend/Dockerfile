# 빌드 스테이지
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Gradle Wrapper와 설정 파일만 먼저 복사 (레이어 캐싱 활용)
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

COPY gradle.properties .

# gradlew 스크립트를 우회하여 직접 실행 (Railway JVM 환경변수 충돌 방지)
RUN chmod +x gradlew && \
    env -u JAVA_TOOL_OPTIONS -u _JAVA_OPTIONS -u JDK_JAVA_OPTIONS -u JAVA_OPTS \
    java -Xmx512m -Xms256m -cp gradle/wrapper/gradle-wrapper.jar org.gradle.wrapper.GradleWrapperMain dependencies --no-daemon

# 소스 복사 후 빌드
COPY src src
RUN env -u JAVA_TOOL_OPTIONS -u _JAVA_OPTIONS -u JDK_JAVA_OPTIONS -u JAVA_OPTS \
    java -Xmx512m -Xms256m -cp gradle/wrapper/gradle-wrapper.jar org.gradle.wrapper.GradleWrapperMain bootJar --no-daemon

# 실행 스테이지
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
