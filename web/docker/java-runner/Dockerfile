# Linux amd64 JDK 25; digest verified using docker manifest inspect eclipse-temurin:25-jdk-noble.
FROM eclipse-temurin@sha256:955c8b94714bc2b5dba5f741bb3b65017287c66fe8d5bf0537e65031a16266ff
RUN groupadd --gid 10001 runner && useradd --uid 10001 --gid 10001 --no-create-home runner
USER 10001:10001
WORKDIR /work
ENTRYPOINT ["sleep", "infinity"]
