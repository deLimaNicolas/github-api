FROM node

WORKDIR /project

COPY . /project

RUN npm install

CMD ["npm","start"]