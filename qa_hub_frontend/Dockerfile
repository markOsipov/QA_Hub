FROM node:18-alpine

ARG NEXT_PUBLIC_QA_HUB_BACKEND

COPY . /app
WORKDIR /app

RUN echo "NEXT_PUBLIC_QA_HUB_BACKEND=$NEXT_PUBLIC_QA_HUB_BACKEND" > /app/env.production
RUN npm i next && npm run build

EXPOSE 3000

ENTRYPOINT npm run start

