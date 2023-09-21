# using development stage to build the app and get rid of
# the dev dependencies
FROM node:alpine AS development

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY . .

RUN pnpm install

# build the app
RUN pnpm run build

# prod stage
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

# install only prod dependencies not dev dependencies
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/main" ]