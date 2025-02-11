FROM node:lts-alpine

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["npx", "next", "start", "-p", "${PORT}"]