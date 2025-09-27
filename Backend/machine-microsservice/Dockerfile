FROM node:20-alpine

WORKDIR /app

COPY machine-microsservice/package*.json ./
COPY event-bus/package*.json ../event-bus/

RUN npm ci --omit=dev && cd ../event-bus && npm ci --omit=dev

COPY machine-microsservice/ ./

COPY event-bus/ ../event-bus/

COPY .env ../.env

EXPOSE 3020
ENV NODE_ENV=production

CMD ["node", "index.js"]