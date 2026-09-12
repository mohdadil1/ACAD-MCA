FROM node:20-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       python3 \
       default-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "index.js"]
