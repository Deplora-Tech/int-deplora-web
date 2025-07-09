FROM node:lts-alpine

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]