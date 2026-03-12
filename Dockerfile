# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build production assets
RUN npm run build:prod

# ---- Production Stage ----
FROM nginx:1.27-alpine AS production

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
