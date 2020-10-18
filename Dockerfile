FROM node:12.19.0-slim
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package.json package-lock*.json ./
RUN npm install && npm cache clean --force
COPY --chown=node:node . .
RUN node imagecacher.js
CMD [ "npm", "run", "dev" ]

EXPOSE 8082
