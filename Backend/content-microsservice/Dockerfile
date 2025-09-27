FROM node:20-alpine

WORKDIR /app

COPY content-microsservice/package*.json ./
COPY food-microsservice/package*.json ../food-microsservice/
COPY machine-microsservice/package*.json ../machine-microsservice/
COPY event-bus/package*.json ../event-bus/

RUN npm ci --omit=dev && cd ../food-microsservice && npm ci --omit=dev && cd ../machine-microsservice && npm ci --omit=dev && cd ../event-bus && npm ci --omit=dev

COPY content-microsservice/ ./

COPY event-bus/ ../event-bus/

COPY food-microsservice/ ../food-microsservice/
COPY machine-microsservice/ ../machine-microsservice/

COPY .env ../.env

EXPOSE 3025
ENV NODE_ENV=production

CMD ["node", "index.js"]