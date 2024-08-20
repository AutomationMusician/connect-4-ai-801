FROM node:22-alpine

COPY . /opt/connect4
WORKDIR /opt/connect4/server
RUN npm ci
EXPOSE 3000
USER "node"

# "npm start" doesn't seem ideal, 
# but I had to do it to get SIGINT to kill my containerhttps://stackoverflow.com/a/77780507/13482696
CMD [ "npm", "start" ]