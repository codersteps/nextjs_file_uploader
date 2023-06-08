# dependencies image
FROM node:14-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# build image
FROM node:14-alpine
WORKDIR /app
COPY --from=0 /app/node_modules ./node_modules
COPY . .
RUN yarn build
RUN rm -rf node_modules
RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline

# build output image
FROM node:14-alpine

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
WORKDIR /app
COPY --from=1 --chown=nextjs:nodejs /app/package.json /app/yarn.lock ./
COPY --from=1 --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=1 --chown=nextjs:nodejs /app/public ./public
COPY --from=1 --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000

CMD [ "yarn", "start" ]