FROM node:8

MAINTAINER Kieran Gibb <kieran@tenthousandthings.org.uk>

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --quiet

COPY . .
