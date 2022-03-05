FROM node:12 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


# Second Stage : Setup command to run your app using lightweight node image
FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN chmod +x ./run.sh
EXPOSE 4000
ENTRYPOINT ["/app/run.sh"]