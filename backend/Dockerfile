# 빌드 스테이지
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Gradle Wrapper와 설정 파일만 먼저 복사 (레이어 캐싱 활용)
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# 외부 환경에서 주입될 수 있는 JVM 메모리 제한 설정을 덮어씀
ENV GRADLE_OPTS="-Xmx512m -Xms256m"
ENV JAVA_TOOL_OPTIONS=""

# 의존성 다운로드
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon

# 소스 복사 후 빌드
COPY src src
RUN ./gradlew bootJar --no-daemon

# 실행 스테이지
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
