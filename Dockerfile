FROM node:20-alpine AS build
WORKDIR /app

COPY . .

RUN npm install --omit=dev || true
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist

RUN npm install -g serve

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
