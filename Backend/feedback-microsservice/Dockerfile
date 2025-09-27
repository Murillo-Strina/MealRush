FROM node:20-alpine

WORKDIR /app

COPY feedback-microsservice/package*.json ./
COPY event-bus/package*.json ../event-bus/

RUN npm ci --omit=dev && cd ../event-bus && npm ci --omit=dev

COPY feedback-microsservice/ ./

COPY event-bus/ ../event-bus/

COPY .env ../.env

EXPOSE 3015
ENV NODE_ENV=production

CMD ["node", "index.js"]