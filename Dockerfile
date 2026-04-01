FROM node:20-alpine AS build
WORKDIR /app
ENV npm_config_registry=https://registry.npmjs.org/
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm config delete proxy || true
RUN npm config delete https-proxy || true
RUN npm config set strict-ssl false
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV PORT=8080
ENV npm_config_registry=https://registry.npmjs.org/
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm config delete proxy || true
RUN npm config delete https-proxy || true
RUN npm config set strict-ssl false
RUN npm ci --no-audit --no-fund --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 8080
HEALTHCHECK CMD curl --fail http://127.0.0.1:8080/api/health || exit 1
CMD ["npm", "start"]
