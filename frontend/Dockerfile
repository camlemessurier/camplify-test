FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Bake the API URL into the client bundle at build time.
# Override with --build-arg NEXT_PUBLIC_API_URL=... for different environments.
ARG NEXT_PUBLIC_API_URL=http://localhost:7777/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 8888
CMD ["npm", "start", "--", "-p", "8888"]
