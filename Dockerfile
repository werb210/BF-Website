FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm config set registry https://registry.npmjs.org/
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force
RUN npm install --package-lock-only
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV PORT=8080
COPY package*.json ./
COPY .npmrc ./
RUN npm config set registry https://registry.npmjs.org/
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force
RUN npm install --package-lock-only
RUN npm ci --no-audit --no-fund --omit=dev
RUN npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 8080
HEALTHCHECK CMD curl --fail http://127.0.0.1:8080/api/health || exit 1
CMD ["npm", "start"]
