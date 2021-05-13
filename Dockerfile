FROM node:14 as builder

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends libx11-dev libxext-dev libxss-dev libxkbfile-dev rpm \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/ferdi

COPY package*.json ./
COPY lerna.json ./

# Note: This is being set to bypass the error with missing git repo information for the 'preval-build-info' module
ENV PREVAL_BUILD_INFO_PLACEHOLDERS=true

RUN npm i node-gyp@8.0.0 node-sass@5.0.0 \
    && npx lerna bootstrap

COPY . .

RUN cd recipes && npm i && npm run package && cd .. \
    && npm run build

FROM busybox

WORKDIR /ferdi

COPY --from=builder /usr/src/ferdi/out/* /ferdi/

VOLUME [ "/ferdi-out" ]
