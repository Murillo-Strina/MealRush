# ====== Build (SDK completo) ======
FROM dart:stable AS build

WORKDIR /app
COPY pubspec.* ./
RUN dart pub get

# Copia o restante do código e compila AOT
COPY . .
RUN dart compile exe bin/server.dart -o /app/bin/server

# ====== Runtime (distroless + libs do Dart) ======
FROM gcr.io/distroless/base-debian12:nonroot

# Copia o "runtime" do Dart (libs necessárias p/ binário AOT)
COPY --from=build /runtime/ /

# Copia somente o binário
COPY --from=build /app/bin/server /app/bin/server

# Porta do serviço Shelf
EXPOSE 8082

WORKDIR /app
USER nonroot

# Em K8s você injeta envs via Secret/ConfigMap, então não precisa de .env aqui
# (Se seu código insistir em ler um .env com caminho fixo, veja observação abaixo)

CMD ["/app/bin/server"]
