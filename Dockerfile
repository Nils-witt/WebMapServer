# Use Node 20.16 alpine as base image
FROM node:latest AS builder
ENV NODE_ENV=development

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

FROM node:latest AS production
ENV NODE_ENV=production

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY --from=builder /app/dist/ dist/
COPY views ./views
COPY public ./public

EXPOSE 3000

CMD [ "node", "dist/main.js"]
LABEL authors="nils@nils-witt.de"
