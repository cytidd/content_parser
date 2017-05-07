FROM node:7

RUN apt-get update && \
    apt-get install -y libgtk2.0-0 libgconf-2-4 \
    libasound2 libxtst6 libxss1 libnss3 xvfb

WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install

CMD ["node", "--version"]
