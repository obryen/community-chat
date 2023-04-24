FROM node:16.16.0-alpine
WORKDIR /chat
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["yarn", "run", "start:prod"]
