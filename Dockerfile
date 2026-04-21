FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS backend

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --production

COPY backend/ ./

COPY --from=frontend /app/dist ./dist

EXPOSE 8080

CMD ["node", "src/app.js"]