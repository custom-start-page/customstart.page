FROM node:8 AS build
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run-script build
RUN ./dist.sh

FROM node:8 as runtime
WORKDIR /app
COPY --from=build /app/dist ./

RUN npm install --only=prod

EXPOSE 80
CMD [ "node", "server.js" ]
