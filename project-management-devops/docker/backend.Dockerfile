FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package.json /app/package.json
RUN npm install --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY backend /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]