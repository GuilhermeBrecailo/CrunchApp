# /web/Dockerfile
# TROQUE A LINHA ABAIXO (de alpine para slim)
FROM node:20-slim 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Caso seja a porta 3000
EXPOSE 3000