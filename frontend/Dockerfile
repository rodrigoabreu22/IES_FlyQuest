FROM node:22.11.0-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "dev"]

#docker build -t frontend-app .
#docker run --name frontend -p 3000:3000 frontend-app