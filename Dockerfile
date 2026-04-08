FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .npmrc* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY .npmrc* ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["npm", "start"]
HEALTHCHECK CMD curl --fail http://0.0.0.0:8080/ || exit 1
