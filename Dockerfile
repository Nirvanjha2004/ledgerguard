FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build || echo "no build"
EXPOSE 3000 3001
CMD ["npm","run","dev"]
