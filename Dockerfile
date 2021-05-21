 # syntax=docker/dockerfile:1
 FROM node:12-alpine
 RUN apk add --no-cache python g++ make
 WORKDIR /nrs-tutorijal6
 COPY . .
 RUN yarn install --production
 CMD ["node", "index.js"]