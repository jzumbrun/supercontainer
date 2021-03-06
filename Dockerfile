FROM node:12.16.1-alpine
RUN apk add bash;

WORKDIR /var/www/app/server

COPY package*.json ./
RUN npm ci --only=production

WORKDIR /var/www/app
COPY . .

RUN npm install -g standard && \
    npm install -g pm2 && \
    npm install -g mocha
