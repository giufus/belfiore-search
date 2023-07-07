FROM node:18.16.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npx tsc
RUN node src/setup.js

CMD [ "node", "src/server.js" ]