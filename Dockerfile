FROM node:22-alpine

COPY . /opt/connect4
WORKDIR /opt/connect4/server
RUN npm ci
ENTRYPOINT [ "node", "index.js" ]
EXPOSE 3000