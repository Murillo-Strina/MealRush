# Use latest stable channel SDK.
FROM dart:stable AS build

# Resolve app dependencies.
WORKDIR /app
COPY pubspec.* ./
RUN dart pub get

# Copy app source code (except anything in .dockerignore) and AOT compile app.
COPY . .
RUN dart compile exe bin/server.dart -o bin/server

# Build minimal serving image from AOT-compiled `/server`
# and the pre-built AOT-runtime in the `/runtime/` directory of the base image.
FROM gcr.io/distroless/cc-debian11:nonroot
COPY --from=build /app /app

# Start server.
EXPOSE 8081
WORKDIR /app
CMD ["/usr/bin/dart", "run", "bin/server.dart"]
