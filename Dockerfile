FROM node:14 as builder

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends libx11-dev libxext-dev libxss-dev libxkbfile-dev rpm \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/ferdi

COPY package*.json ./
COPY lerna.json ./

RUN npm i gulp@^4.0.0
RUN npx lerna bootstrap

COPY . .

RUN npm run build

FROM busybox

WORKDIR /ferdi

COPY --from=builder /usr/src/ferdi/out/* /ferdi/

VOLUME [ "/ferdi-out" ]
