FROM node:20-alpine

WORKDIR /app

COPY machine-microsservice/package*.json ./
COPY event-bus/package*.json ../event-bus/

RUN npm ci && cd ../event-bus && npm ci

COPY machine-microsservice/ ./

COPY event-bus/ ../event-bus/

COPY .env ../.env

EXPOSE 3010
ENV NODE_ENV=production

CMD ["node", "index.js"]