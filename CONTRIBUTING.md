# Contributing to Ferdi 5

:tada: First off, thanks for taking the time and your effort to make Ferdi better! :tada:

## Table of contents

<!-- TOC depthFrom:2 depthTo:2 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Contributing to Ferdi 5](#contributing-to-ferdi-5)
  - [Table of contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [What should I know before I get started?](#what-should-i-know-before-i-get-started)
  - [How Can I Contribute?](#how-can-i-contribute)
  - [Setting up your Development machine](#setting-up-your-development-machine)
    - [Install System-level dependencies](#install-system-level-dependencies)
      - [Node.js, npm, node-gyp](#nodejs-npm-node-gyp)
      - [Git](#git)
      - [Debian/Ubuntu](#debianubuntu)
      - [Fedora](#fedora)
      - [Windows](#windows)
    - [Clone repository with submodule](#clone-repository-with-submodule)
    - [Local caching of dependencies](#local-caching-of-dependencies)
    - [Install dependencies](#install-dependencies)
    - [Fix native modules to match current electron node version](#fix-native-modules-to-match-current-electron-node-version)
    - [Package recipe repository](#package-recipe-repository)
    - [Using Docker to build a linux-targetted packaged app](#using-docker-to-build-a-linux-targetted-packaged-app)
    - [Code Signing on a mac](#code-signing-on-a-mac)
    - [Start development app](#start-development-app)
    - [Styleguide](#styleguide)
      - [Git Commit Messages format](#git-commit-messages-format)
      - [Javascript Coding style-checker](#javascript-coding-style-checker)
  - [Packaging](#packaging)
  - [Release](#release)

<!-- /TOC -->

## Code of Conduct

This project and everyone participating in it is governed by the [Ferdi Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [stefan@adlk.io](mailto:stefan@adlk.io).

## What should I know before I get started?

For the moment, Ferdi's development is a bit slow but all contributions are highly appreciated. [Check this issue for discussion](https://github.com/getferdi/ferdi/issues/956).

## How Can I Contribute?

As a basic rule, before filing issues, feature requests or anything else. Take a look at the issues and check if this has not already been reported by another user. If so, engage in the already existing discussion.

## Setting up your Development machine

### Install System-level dependencies

#### Node.js, npm, node-gyp

Please make sure you are running the exact node version used by the developers/contributors as specified in the [nvmrc file](./.nvmrc).

Currently, these are the combinations of system dependencies that work on an intel-based machines for MacOS/Linux/Windows (building on an ARM-based machine is still a work-in-progress due to node-sass native dependencies)

```bash
node -v
v14.16.1
npm -v
6.14.12
node-gyp -v
v8.0.0
```

#### Git

The version [2.23.0](https://github.com/git-for-windows/git/releases/tag/v2.23.0.windows.1) for Git is working fine for development. You can then use the console from Git to do the development procedure.

_Note:_ This list can likely get outdated. If so, please refer to the specific version of the [electronuserland builder](https://hub.docker.com/r/electronuserland/builder) that we use in our [Dockerfile](./Dockerfile).

#### Debian/Ubuntu

```bash
apt install ca-certificates curl netbase wget tzdata rpm
```

#### Fedora

```bash
dnf install libX11-devel libXext-devel libXScrnSaver-devel libxkbfile-devel rpm
```

#### Windows

Please make sure you run this command as an administrator:

```bash
npm i -g windows-build-tools --vs2015
```

### Clone repository with submodule

```bash
git clone https://github.com/getferdi/ferdi.git
cd ferdi
git submodule update --init --recursive
```

It is important you execute the last command to get the required submodules (recipes, server).

### Local caching of dependencies

Set these env vars into your profile (or if you use [direnv](https://direnv.net/), you can manage them via the respective `.envrc` file)

```bash
export ELECTRON_CACHE=$HOME/.cache/electron
export ELECTRON_BUILDER_CACHE=$HOME/.cache/electron-builder
```

### Install dependencies

Run the following command to install all dependencies, and link sibling modules with Ferdi.

```bash
npx lerna bootstrap
```

If you previously ran `npm install`, it sometimes is necessary to delete your `node_modules` folder before running `npx lerna bootstrap`. If you encounter the `gyp: No Xcode or CLT version` error on macOS at this step, please have a look [here](https://medium.com/flawless-app-stories/gyp-no-xcode-or-clt-version-detected-macos-catalina-anansewaa-38b536389e8d).

### Fix native modules to match current electron node version

```bash
npm run rebuild
```

### Package recipe repository

Ferdi requires its recipes to be packaged before it can use it. When running Ferdi as a development instance, you'll need to package the local recipes before you can create any services inside Ferdi.

```bash
cd recipes && npm i && npm run package
```

### Using Docker to build a linux-targetted packaged app

```bash
docker build -t ferdi-package .
```

The above will place all the built artifacts into the `/ferdi` folder within the image.

If you want to copy them outside of the image, simply mount a volume into a different location, and copy all files from `/ferdi` into the mounted folder (`/ferdi-out` in the example command below).

```bash
DATE=`date +"%Y-%b-%d-%H-%M"`
mkdir -p ~/Downloads/$DATE
docker run -e GIT_SHA=`git rev-parse --short HEAD` -v ~/Downloads/$DATE:/ferdi-out -it ferdi-package sh
# inside the container:
mv /ferdi/Ferdi-*.AppImage /ferdi-out/Ferdi-$GIT_SHA.AppImage
mv /ferdi/ferdi-*.tar.gz /ferdi-out/Ferdi-$GIT_SHA.tar.gz
mv /ferdi/ferdi-*.x86_64.rpm /ferdi-out/Ferdi-x86_64-$GIT_SHA.rpm
mv /ferdi/ferdi_*_amd64.deb /ferdi-out/Ferdi-amd64-$GIT_SHA.deb
mv /ferdi/ferdi-*.freebsd /ferdi-out/Ferdi-$GIT_SHA.freebsd
mv /ferdi/ferdi /ferdi-out/Ferdi-$GIT_SHA
mv /ferdi/latest-linux.yml /ferdi-out/latest-linux-$GIT_SHA.yml
```

### Code Signing on a mac

If you are building the packaged app (on a mac) for local testing, you can set this environment variable to bypass the code signing step during the packaging process (`npm run build`):

```bash
export CSC_IDENTITY_AUTO_DISCOVERY=false
```

Or else, if you want to self-sign on a mac with non-registered certificate (not for distribution of the resulting package), you can follow [this thread](https://github.com/electron/electron/issues/7476#issuecomment-356084754) and run this command:

```bash
codesign --deep --force --verbose --sign - node_modules/electron/dist/Electron.app
```

### Start development app

Run these two commands **simultaneously** in different terminals:

```bash
npm run dev
DEBUG=Ferdi:* npm run start
```

Optionally, you can run both commands in one terminal with [misty](https://github.com/adlk/misty) (see [misty.yml](https://github.com/getferdi/ferdi/blob/develop/misty.yml)):

```bash
DEBUG=Ferdi:* npx misty
```

Note: please prefer [`debug()`](https://github.com/visionmedia/debug) over `console.log()`.

### Styleguide

#### Git Commit Messages format

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- When only changing documentation, include `[ci skip]` in the commit description

#### Javascript Coding style-checker

- Please use `es-lint` and the defined rules to maintain a consistent style

## Packaging

```bash
npm run build
```

Assets will be available in the `out` folder.

## Release

Create a new [draft release](https://github.com/getferdi/ferdi/releases/new) that targets the `release` branch, then:

```bash
git checkout develop && git pull -r
git checkout release
git submodule update --remote --force
git commit -am "Update submodules"
git merge --no-ff develop
git push
```

Once the draft release assets are uploaded (13 assets), publish the release (you will need elevated permissions in GitHub for doing this). The last commit of the `release` branch will be tagged. You can then merge `release` into `master` and back into `develop` if needed
