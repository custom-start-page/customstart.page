FROM node:8-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run-script build
RUN sh dist.sh

FROM node:8-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist ./

RUN npm ci --only=production

USER node
EXPOSE 80
CMD [ "node", "server.js" ]
