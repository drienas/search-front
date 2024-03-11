# build stage
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN export NODE_OPTIONS=--openssl-legacy-provider && npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
ENV NODE_ENV=development
CMD ["nginx", "-g", "daemon off;"]