# Stage 1: Build the SvelteKit app
FROM node:20-alpine AS builder

RUN apk add --no-cache \
  libc6-compat \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  bash

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env
RUN npm run build

# Stage 2: Run the SvelteKit preview server
FROM node:20-alpine AS runner

ENV NODE_ENV=production

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  bash

WORKDIR /app

# ✅ Copy package files for npm install
COPY package*.json ./

# ✅ Install ALL dependencies, including devDependencies
RUN npm install

# ✅ Now copy the rest of the built app from builder
COPY --from=builder /app ./

EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
