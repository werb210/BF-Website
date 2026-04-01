FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config delete @jridgewell:registry || true
RUN npm ci --prefer-online --no-audit
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV PORT=8080
COPY package*.json ./
COPY .npmrc ./
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config delete @jridgewell:registry || true
RUN npm ci --prefer-online --no-audit
RUN npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 8080
HEALTHCHECK CMD curl --fail http://127.0.0.1:8080/api/health || exit 1
CMD ["npm", "start"]
