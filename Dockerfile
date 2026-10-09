FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# the movie model appends to Log/log.txt, so the non-root user needs to own it
RUN mkdir -p Log && chown -R node:node Log
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/v1/movies/highest-rated').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# npm start uses nodemon, which is a dev dependency and not installed here
CMD ["node", "server.js"]
