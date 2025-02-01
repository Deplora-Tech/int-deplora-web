FROM node:lts-alpine

WORKDIR /app

COPY . /app

RUN npm install --production

EXPOSE 8080

CMD ["npx", "next", "start", "-p", "${PORT}"]