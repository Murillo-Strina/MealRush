# ====== Build (SDK completo) ======
FROM dart:stable AS build

WORKDIR /app
COPY pubspec.* ./
RUN dart pub get

COPY . .
RUN dart compile exe bin/server.dart -o /app/bin/server

FROM gcr.io/distroless/base-debian12:nonroot

COPY --from=build /runtime/ /

COPY --from=build /app/bin/server /app/bin/server

EXPOSE 8082

WORKDIR /app
USER nonroot

CMD ["/app/bin/server"]
