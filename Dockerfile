FROM node:18.16.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build
RUN npm run vitest
RUN npm run setup

CMD [ "npm", "run", "start" ]