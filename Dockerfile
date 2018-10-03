FROM node:8


# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#TO TACLE BELOW ISSUE
#npm ERR! code UNABLE_TO_GET_ISSUER_CERT_LOCALLY
#npm ERR! errno UNABLE_TO_GET_ISSUER_CERT_LOCALLY
#npm ERR! request to https://registry.npmjs.org/express failed, reason: unable to get local issuer certificate

#npm ERR! A complete log of this run can be found in:
#npm ERR!     /root/.npm/_logs/2018-10-03T17_41_17_505Z-debug.log

RUN npm config set strict-ssl=false

#TO TACLE BELOW ISSUE
#npm ERR! code E403
#npm ERR! 403 Forbidden: term-size@^1.2.0

RUN npm config set always-auth=true

RUN npm install

# Bundle app source
COPY . .
RUN npm run build

EXPOSE 8080
CMD [ "npm", "start" ]