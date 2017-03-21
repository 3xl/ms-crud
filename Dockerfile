FROM nodesource/nsolid:boron-2.1.0

COPY .npmrc /root/.npmrc

WORKDIR /app
COPY package.json /app
RUN npm install

RUN rm -f /root/.npmrc

COPY . /app
RUN rm -f /app/.npmrc

EXPOSE 4001

CMD ["npm", "start"]