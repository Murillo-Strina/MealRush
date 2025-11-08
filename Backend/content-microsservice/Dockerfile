FROM node:20-alpine

WORKDIR /app

COPY content-microsservice/package*.json ./
COPY food-microsservice/package*.json ../food-microsservice/
COPY machine-microsservice/package*.json ../machine-microsservice/
COPY event-bus/package*.json ../event-bus/

RUN npm ci && cd ../food-microsservice && npm ci && cd ../machine-microsservice && npm ci && cd ../event-bus && npm ci

COPY content-microsservice/ ./

COPY event-bus/ ../event-bus/

COPY food-microsservice/ ../food-microsservice/
COPY machine-microsservice/ ../machine-microsservice/

COPY .env ../.env

EXPOSE 3025
ENV NODE_ENV=production

CMD ["node", "index.js"]