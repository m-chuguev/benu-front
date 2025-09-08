FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Копируем исходники и собираем
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime
ENV NODE_ENV=production
COPY --from=build /dist /usr/share/nginx/html
