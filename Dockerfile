# dependencies image
FROM node:16-alpine

WORKDIR /app

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler


COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# build image
FROM node:16-alpine
WORKDIR /app
COPY --from=0 /app/node_modules ./node_modules
COPY . .
RUN yarn build
RUN rm -rf node_modules
RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline

# build output image
FROM node:16-alpine

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

# Fetch secrets and print them using "printenv" command
ENTRYPOINT ["doppler", "run", "--"]
CMD [ "yarn", "start" ]