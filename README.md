<p align="center">
    <img src="./build-helpers/images/icon.png" alt="" width="200"/>
</p>

# Ferdi

<p align="center">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section --><a href='#contributors-' style='width:25%'><img src='https://img.shields.io/badge/contributors-38-default.svg?logo=github' alt='Contributors'/></a><!-- ALL-CONTRIBUTORS-BADGE:END --> 
<a href="#backers-via-opencollective"><img alt="Open Collective backers" src="https://img.shields.io/opencollective/backers/getferdi?logo=open-collective"></a>
<a href="#sponsors-via-opencollective"><img alt="Open Collective sponsors" src="https://img.shields.io/opencollective/sponsors/getferdi?logo=open-collective"></a>
<a href="https://ci.appveyor.com/project/kytwb/ferdi"><img alt="Build Status Windows" src="https://img.shields.io/appveyor/ci/kytwb/ferdi/master?logo=appveyor"></a>
<a href="https://travis-ci.org/getferdi/ferdi"><img alt="Build Status Mac & Linux" src="https://img.shields.io/travis/getferdi/ferdi/master?logo=travis"></a>
</p>

🤴🏽 Hard-fork of [Franz](https://github.com/meetfranz/franz), adding awesome features and removing unwanted ones.

### Table of contents

<details>
<summary>Toggle navigation</summary>

- [Ferdi](#ferdi)
    - [Table of contents](#table-of-contents)
    - [What is Ferdi?](#what-is-ferdi)
    - [What does Ferdi look like?](#what-does-ferdi-look-like)
  - [Download Ferdi](#download-ferdi)
    - [Or use homebrew (macOS only)](#or-use-homebrew-macos-only)
    - [Or use AUR (Arch Linux)](#or-use-aur-arch-linux)
  - [Ferdi-specific Features](#ferdi-specific-features)
  - [Development](#development)
    - [Install OS dependencies](#install-os-dependencies)
      - [Node.js](#nodejs)
      - [Git](#git)
      - [Debian/Ubuntu](#debianubuntu)
      - [Fedora](#fedora)
      - [Windows](#windows)
    - [Clone repository with submodule](#clone-repository-with-submodule)
    - [Install dependencies](#install-dependencies)
    - [Fix native modules to match current electron node version](#fix-native-modules-to-match-current-electron-node-version)
    - [Start development app](#start-development-app)
    - [Packaging](#packaging)
    - [Release](#release)
  - [Contributors ✨](#contributors-%e2%9c%a8)
  - [Backers via OpenCollective](#backers-via-opencollective)
  - [Sponsors via OpenCollective](#sponsors-via-opencollective)
</details>

### What is Ferdi?

Ferdi is a messaging browser that allows you to combine your favorite messaging services into one application. It is based on Franz - a software already used by thousands of people - with the difference that Ferdi gives you many additonal features and doesn't restrict its usage! Ferdi is compatible with your existing Franz account so you can continue right where you left off. Find out more about Ferdi and its features on [getferdi.com](https://getferdi.com).

### What does Ferdi look like?

<details>
<summary>Toggle screenshots</summary>
<p align="center">
<img alt="Keep all your messaging services in one place." src="./branding/screenshots/hero.png">
<em>"Keep all your messaging services in one place."</em>
<img alt="Order your services with Ferdi Workspaces." src="./branding/screenshots/workspaces.png">
<em>"Order your services with Ferdi Workspaces."</em>
<img alt="Always keep your Todos list open with Ferdi Todos." src="./branding/screenshots/todos.png">
<em>"Always keep your Todos list open with Ferdi Todos."</em>
<img alt="Supporting all your services." src="./branding/screenshots/service-store.png">
<em>"Supporting all your services."</em>
</p>
</details>

## Download Ferdi

You can download Ferdi for Windows, Mac and Linux on [Ferdi's download page](https://getferdi.com/download) or you can find all variants in the [latest stable release](https://github.com/getferdi/ferdi/releases/latest) assets and [all the other release here](https://github.com/getferdi/ferdi/releases).

### Or use homebrew (macOS only)

`$ brew cask install ferdi`

(Don't know homebrew? [brew.sh](https://brew.sh/))

### Or use AUR (Arch Linux)

Ferdi has three seperate AUR packages you can use:
- **[ferdi](https://aur.archlinux.org/packages/ferdi/)**: Uses your system electron version to run the latest release
- **[ferdi-bin](https://aur.archlinux.org/packages/ferdi-bin/)**: Uses the latest Fedora release and extracts it to Arch
- **[ferdi-git](https://aur.archlinux.org/packages/ferdi-git/)**: Uses your system electron version to run the latest commit from the develop branch

We suggest using the `ferdi` package first as it will work best on most systems.
Some systems may have an incompatible Electron version installed so if you are experiencing problems with `ferdi`, please use `ferdi-bin` instead.

`ferdi-git` will use the latest Git commit and thus may be unstable but may also give you features that are not yet available in other versions. Please only use `ferdi-git` if you accept these risks.

If you use an AUR Helper e.g. yay, simply install it via `yay -S ferdi`.

## Ferdi-specific Features

- [x] Removes the counter-productive fullscreen app delay inviting users to upgrade
- [x] Removes pages begging you to donate after registration
- [x] Remove "Franz is better together" popup
- [x] Remove bug that would incorrectly display unread messages count on some services (more info in [7566ccd](https://github.com/getferdi/ferdi/commit/7566ccd))
- [x] Makes all users Premium by default ([#15](https://github.com/getferdi/ferdi/issues/15))
- [x] Using the Ferdi API instead of Franz's servers
- [x] Upgrading to Electron 7
- [x] Add several new services
- [x] [Add option to change server to a custom](https://github.com/getferdi/ferdi/wiki/Custom-Server) [ferdi-server](https://github.com/getferdi/server)
- [x] Add option to use Ferdi without an account ([#5](https://github.com/getferdi/ferdi/issues/5))
- [x] Add "Private Notification"-Mode, that hides message content from notifications ([franz#879](https://github.com/meetfranz/franz/issues/879))
- [x] Add Password Lock feature to keep your messages protected ([#41](https://github.com/getferdi/ferdi/issues/41), [franz#810](https://github.com/meetfranz/franz/issues/810), [franz#950](https://github.com/meetfranz/franz/issues/950), [franz#1430](https://github.com/meetfranz/franz/issues/1430))
- [x] Add an option to keep individual workspaces always loaded ([#37](https://github.com/getferdi/ferdi/issues/37))
- [x] Add Universal Dark Mode via the [DarkReader extension](https://github.com/darkreader/darkreader) ([#71](https://github.com/getferdi/ferdi/issues/71))
- [x] Add adaptable Dark Mode that will respect the system's Dark Mode setting ([#173](https://github.com/getferdi/ferdi/issues/173))
- [x] Add an option to auto-hide the menubar ([#7](https://github.com/getferdi/ferdi/issues/7), [franz#833](https://github.com/meetfranz/franz/issues/833))
- [x] Add "Quick Switch" feature to help you navigate a long list of services (similar to Rambox's [Quick Switcher](https://rambox.pro/#feature-details/quick_switcher))
- [x] Add "Service Hibernation" that will automatically unload services when they are unused
- [x] Add "Scheduled Do-not-Disturb" feature in which you won't get notifications (similar to Rambox's [Work Hours](https://rambox.pro/#feature-details/work_hours))
- [x] Add CTRL+← and CTRL+→ shortcuts and menu options to go back and forward in the service browsing history([#39](https://github.com/getferdi/ferdi/issues/39))
- [x] Add option to show a browser-like navigation bar on all services
- [x] Add option to change accent color
- [x] Add local [recipe repository](https://github.com/getferdi/recipes) that removes the need of downloading recipes from a remote server
- [x] Add portable version for Windows
- [x] Add Process Manager to find services using a lot of resources
- [x] Add "npm run prepare-code" command for development to lint and beautify code
- [x] Add button to open darkmode.css for a service
- [x] [Add `user.css` and `user.js` that allows users to inject custom code into services](https://github.com/getferdi/ferdi/wiki/Using-user.css-and-user.js) ([#83](https://github.com/getferdi/ferdi/issues/83))
- [x] Allow SVGs for service custom icon
- [x] Switch to [`electron-spellchecker`](https://github.com/electron-userland/electron-spellchecker) to improve application size
- [x] Improve "About Ferdi" screen to better display versions
- [x] Minifying build files to improve app size
- [x] [Makes it possible to edit the "Franz Todos" service](https://github.com/getferdi/ferdi/wiki/Custom-Todo) (e.g. Todoist via https://todoist.com/app)
- [x] Makes RocketChat self-hosted generally available ([#6](https://github.com/getferdi/ferdi/issues/6))
- [x] Comes with a custom branding proper to Ferdi
- [x] UI improvements

## Development

### Install OS dependencies

#### Node.js

Please make sure you are running NodeJS v10 ([v10.16.3](https://nodejs.org/dist/v10.16.3/) suggested). Versions above will throw an errow when trying to install due to an [old fsevent dependency](https://github.com/fsevents/fsevents/issues/278).

#### Git

The version [2.23.0](https://github.com/git-for-windows/git/releases/tag/v2.23.0.windows.1) for Git is working fine for development. You can then use the console from Git to do the development procedure.

#### Debian/Ubuntu

```bash
$ apt install libx11-dev libxext-dev libxss-dev libxkbfile-dev
```

#### Fedora

```bash
$ dnf install libX11-devel libXext-devel libXScrnSaver-devel libxkbfile-devel
```

#### Windows

```bash
$ npm install --global windows-build-tools --vs2015
```

### Clone repository with submodule

```bash
$ git clone https://github.com/getferdi/ferdi.git
$ cd ferdi
$ git submodule update --init --recursive
```

It is important you execute the last command to get the required submodules (recipes, server).

### Install dependencies

Run the following command to install all dependencies, and link sibling modules with Ferdi.

```bash
$ npx lerna bootstrap
```

If you previously ran `npm install` it sometimes is necessary to delete your `node_modules` folder before running `npx lerna bootstrap`.

### Fix native modules to match current electron node version

```bash
$ npm run rebuild
```

### Start development app

Run these two commands **simultaneously** in different terminals:

```bash
$ npm run dev
$ npm run start
```

Optionally, you can run both commands in one terminal with [misty](https://github.com/adlk/misty) (see [misty.yml](https://github.com/getferdi/ferdi/blob/develop/misty.yml)):

```bash
$ npx misty
```

Be aware that the development database will be reset regularly.

### Packaging

```bash
$ npm run build
```

Deliverables will be available in the `out` folder.

### Release

```bash
$ git checkout develop && git pull
$ git submodule update --remote --force
$ git add .
$ git commit -m "Update submodules"
$ git checkout master
$ git merge --no-ff develop
$ git tag v5.3.4-beta.4
$ git push --tags
```

When pushing a new tag, the CI builds will create a draft GitHub release and upload the deliverables in the draft release assets. Wait for all the assets to be uploaded before publishing the draft release.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://vantezzen.io"><img src="https://avatars2.githubusercontent.com/u/10333196?v=4" width="40px;" alt="Bennett"/><br /><sub><b>Bennett</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=vantezzen" title="Code">💻</a> <a href="#design-vantezzen" title="Design">🎨</a> <a href="https://github.com/getferdi/ferdi/commits?author=vantezzen" title="Documentation">📖</a> <a href="#ideas-vantezzen" title="Ideas, Planning, & Feedback">🤔</a> <a href="#translation-vantezzen" title="Translation">🌍</a> <a href="#example-vantezzen" title="Examples">💡</a> <a href="https://github.com/getferdi/ferdi/issues?q=author%3Avantezzen" title="Bug reports">🐛</a> <a href="#content-vantezzen" title="Content">🖋</a> <a href="#infra-vantezzen" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#userTesting-vantezzen" title="User Testing">📓</a> <a href="#question-vantezzen" title="Answering Questions">💬</a> <a href="#projectManagement-vantezzen" title="Project Management">📆</a> <a href="https://github.com/getferdi/ferdi/pulls?q=is%3Apr+reviewed-by%3Avantezzen" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://twitter.com/kytwb"><img src="https://avatars0.githubusercontent.com/u/412895?v=4" width="40px;" alt="Amine Mouafik"/><br /><sub><b>Amine Mouafik</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=kytwb" title="Code">💻</a> <a href="#design-kytwb" title="Design">🎨</a> <a href="https://github.com/getferdi/ferdi/commits?author=kytwb" title="Documentation">📖</a> <a href="#ideas-kytwb" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/getferdi/ferdi/issues?q=author%3Akytwb" title="Bug reports">🐛</a> <a href="#content-kytwb" title="Content">🖋</a> <a href="#infra-kytwb" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#userTesting-kytwb" title="User Testing">📓</a> <a href="#question-kytwb" title="Answering Questions">💬</a> <a href="#projectManagement-kytwb" title="Project Management">📆</a> <a href="https://github.com/getferdi/ferdi/pulls?q=is%3Apr+reviewed-by%3Akytwb" title="Reviewed Pull Requests">👀</a> <a href="#maintenance-kytwb" title="Maintenance">🚧</a> <a href="#platform-kytwb" title="Packaging/porting to new platform">📦</a> <a href="#fundingFinding-kytwb" title="Funding Finding">🔍</a> <a href="#blog-kytwb" title="Blogposts">📝</a></td>
    <td align="center"><a href="http://www.adlk.io"><img src="https://avatars1.githubusercontent.com/u/3265004?v=4" width="40px;" alt="Stefan Malzner"/><br /><sub><b>Stefan Malzner</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=adlk" title="Code">💻</a> <a href="#content-adlk" title="Content">🖋</a> <a href="#design-adlk" title="Design">🎨</a> <a href="https://github.com/getferdi/ferdi/commits?author=adlk" title="Documentation">📖</a> <a href="#ideas-adlk" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-adlk" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#projectManagement-adlk" title="Project Management">📆</a> <a href="https://github.com/getferdi/ferdi/commits?author=adlk" title="Tests">⚠️</a> <a href="#translation-adlk" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/Makazzz"><img src="https://avatars2.githubusercontent.com/u/49844464?v=4" width="40px;" alt="Makazzz"/><br /><sub><b>Makazzz</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/issues?q=author%3AMakazzz" title="Bug reports">🐛</a> <a href="https://github.com/getferdi/ferdi/commits?author=Makazzz" title="Code">💻</a> <a href="#translation-Makazzz" title="Translation">🌍</a> <a href="#content-Makazzz" title="Content">🖋</a> <a href="https://github.com/getferdi/ferdi/commits?author=Makazzz" title="Documentation">📖</a> <a href="#platform-Makazzz" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="http://seriesgt.com"><img src="https://avatars3.githubusercontent.com/u/5977640?v=4" width="40px;" alt="ZeroCool"/><br /><sub><b>ZeroCool</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=ZeroCool940711" title="Code">💻</a> <a href="#ideas-ZeroCool940711" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/rseitbekov"><img src="https://avatars2.githubusercontent.com/u/35684439?v=4" width="40px;" alt="rseitbekov"/><br /><sub><b>rseitbekov</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=rseitbekov" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://djangogigs.com/developers/peter-bittner/"><img src="https://avatars2.githubusercontent.com/u/665072?v=4" width="40px;" alt="Peter Bittner"/><br /><sub><b>Peter Bittner</b></sub></a><br /><a href="#ideas-bittner" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/getferdi/ferdi/issues?q=author%3Abittner" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/justus-saul"><img src="https://avatars1.githubusercontent.com/u/5861826?v=4" width="40px;" alt="Justus Saul"/><br /><sub><b>Justus Saul</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/issues?q=author%3Ajustus-saul" title="Bug reports">🐛</a> <a href="#ideas-justus-saul" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/igreil"><img src="https://avatars0.githubusercontent.com/u/17239151?v=4" width="40px;" alt="igreil"/><br /><sub><b>igreil</b></sub></a><br /><a href="#ideas-igreil" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://marcolopes.eu"><img src="https://avatars1.githubusercontent.com/u/431889?v=4" width="40px;" alt="Marco Lopes"/><br /><sub><b>Marco Lopes</b></sub></a><br /><a href="#ideas-marcolopes" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/dayzlun"><img src="https://avatars3.githubusercontent.com/u/17259690?v=4" width="40px;" alt="dayzlun"/><br /><sub><b>dayzlun</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/issues?q=author%3Adayzlun" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://twitter.com/tobigue_"><img src="https://avatars2.githubusercontent.com/u/1560152?v=4" width="40px;" alt="Tobias Günther"/><br /><sub><b>Tobias Günther</b></sub></a><br /><a href="#ideas-tobigue" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/AGCaesar"><img src="https://avatars3.githubusercontent.com/u/7844066?v=4" width="40px;" alt="AGCaesar"/><br /><sub><b>AGCaesar</b></sub></a><br /><a href="#platform-AGCaesar" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://github.com/xthursdayx"><img src="https://avatars0.githubusercontent.com/u/18044308?v=4" width="40px;" alt="xthursdayx"/><br /><sub><b>xthursdayx</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=xthursdayx" title="Code">💻</a> <a href="https://github.com/getferdi/ferdi/commits?author=xthursdayx" title="Documentation">📖</a> <a href="#infra-xthursdayx" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-xthursdayx" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://github.com/Gaboris"><img src="https://avatars2.githubusercontent.com/u/9462372?v=4" width="40px;" alt="Gaboris"/><br /><sub><b>Gaboris</b></sub></a><br /><a href="#question-Gaboris" title="Answering Questions">💬</a> <a href="https://github.com/getferdi/ferdi/issues?q=author%3AGaboris" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.cu3ed.com/"><img src="https://avatars1.githubusercontent.com/u/61343?v=4" width="40px;" alt="Ce"/><br /><sub><b>Ce</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/issues?q=author%3Aincace" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://pztrn.name/"><img src="https://avatars1.githubusercontent.com/u/869402?v=4" width="40px;" alt="Stanislav N."/><br /><sub><b>Stanislav N.</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/issues?q=author%3Apztrn" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.patrickcurl.com"><img src="https://avatars1.githubusercontent.com/u/1470061?v=4" width="40px;" alt="Patrick Curl"/><br /><sub><b>Patrick Curl</b></sub></a><br /><a href="#ideas-patrickcurl" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Stanzilla"><img src="https://avatars3.githubusercontent.com/u/75278?v=4" width="40px;" alt="Benjamin Staneck"/><br /><sub><b>Benjamin Staneck</b></sub></a><br /><a href="#design-Stanzilla" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/ammarmalhas"><img src="https://avatars1.githubusercontent.com/u/57057209?v=4" width="40px;" alt="ammarmalhas"/><br /><sub><b>ammarmalhas</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/issues?q=author%3Aammarmalhas" title="Bug reports">🐛</a> <a href="#security-ammarmalhas" title="Security">🛡️</a></td>
    <td align="center"><a href="https://github.com/steliyan"><img src="https://avatars1.githubusercontent.com/u/1850292?v=4" width="40px;" alt="Steliyan Stoyanov"/><br /><sub><b>Steliyan Stoyanov</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=steliyan" title="Code">💻</a> <a href="#ideas-steliyan" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/brorbw"><img src="https://avatars2.githubusercontent.com/u/5909562?v=4" width="40px;" alt="Bror Winther"/><br /><sub><b>Bror Winther</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=brorbw" title="Documentation">📖</a></td>
    <td align="center"><a href="https://fwdekker.com/"><img src="https://avatars0.githubusercontent.com/u/13442533?v=4" width="40px;" alt="Felix W. Dekker"/><br /><sub><b>Felix W. Dekker</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=FWDekker" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Sauceee"><img src="https://avatars2.githubusercontent.com/u/17987941?v=4" width="40px;" alt="Sauceee"/><br /><sub><b>Sauceee</b></sub></a><br /><a href="#design-Sauceee" title="Design">🎨</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://lhw.ring0.de"><img src="https://avatars2.githubusercontent.com/u/351875?v=4" width="40px;" alt="Lennart Weller"/><br /><sub><b>Lennart Weller</b></sub></a><br /><a href="#platform-lhw" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://github.com/jereksel"><img src="https://avatars0.githubusercontent.com/u/1307829?v=4" width="40px;" alt="Andrzej Ressel"/><br /><sub><b>Andrzej Ressel</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=jereksel" title="Code">💻</a></td>
    <td align="center"><a href="https://gitlab.com/dpeukert"><img src="https://avatars2.githubusercontent.com/u/3451904?v=4" width="40px;" alt="Daniel Peukert"/><br /><sub><b>Daniel Peukert</b></sub></a><br /><a href="https://github.com/getferdi/ferdi/commits?author=dpeukert" title="Code">💻</a></td>
    <td align="center"><a href="https://crowdin.com/profile/Ali_Shiple"><img src="https://crowdin-static.downloads.crowdin.com/avatar/12895436/small/00917d09ca1b4b6d8e0ef36af07ecf6b.jpg" width="40px;" alt="Ali M. Shiple"/><br /><sub><b>Ali M. Shiple</b></sub></a><br /><a href="#translation-Ali_Shiple" title="Translation">🌍</a></td>
    <td align="center"><a href="https://crowdin.com/profile/elviseras"><img src="https://www.gravatar.com/avatar/25c2cf0d8cb4a4141e71c3b8a2e9324f" width="40px;" alt="elviseras"/><br /><sub><b>elviseras</b></sub></a><br /><a href="#translation-elviseras" title="Translation">🌍</a></td>
    <td align="center"><a href="https://crowdin.com/profile/J370"><img src="https://crowdin-static.downloads.crowdin.com/avatar/14141203/small/7b12b5db419d8796450221c2eaaf6003.png" width="40px;" alt="J370"/><br /><sub><b>J370</b></sub></a><br /><a href="#translation-J370" title="Translation">🌍</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://crowdin.com/profile/keunes"><img src="https://crowdin-static.downloads.crowdin.com/avatar/13018172/small/829115c606347b10218f34c637a2100c.png" width="40px;" alt="Koen"/><br /><sub><b>Koen</b></sub></a><br /><a href="#translation-keunes" title="Translation">🌍</a></td>
    <td align="center"><a href="https://crowdin.com/profile/leandrogehlen"><img src="https://crowdin-static.downloads.crowdin.com/avatar/14099621/small/1d9503523839c310dbce0af3c226e894.jpeg" width="40px;" alt="Leandro Gehlen"/><br /><sub><b>Leandro Gehlen</b></sub></a><br /><a href="#translation-leandrogehlen" title="Translation">🌍</a></td>
    <td align="center"><a href="https://crowdin.com/profile/Matthieu42"><img src="https://www.gravatar.com/avatar/735217ccccf11ba97573deee517ddb19" width="40px;" alt="Matthieu42"/><br /><sub><b>Matthieu42</b></sub></a><br /><a href="#translation-Matthieu42" title="Translation">🌍</a></td>
    <td align="center"><a href="https://crowdin.com/profile/nicky18013"><img src="https://crowdin-static.downloads.crowdin.com/avatar/13468928/small/2b31e7ac19645d950a79b33ffd5721b8.png" width="40px;" alt="Nikita Bibanaev"/><br /><sub><b>Nikita Bibanaev</b></sub></a><br /><a href="#translation-nicky18013" title="Translation">🌍</a></td>
    <td align="center"><a href="https://crowdin.com/profile/Tatjana1998"><img src="https://www.gravatar.com/avatar/ade202a04fcbb2c177e4f1d9936af29e" width="40px;" alt="Tatjana1998"/><br /><sub><b>Tatjana1998</b></sub></a><br /><a href="#translation-Tatjana1998" title="Translation">🌍</a></td>
    <td align="center"><a href="https://crowdin.com/profile/seayko"><img src="https://www.gravatar.com/avatar/65e2aef738ddf828f822d8463fd04918" width="40px;" alt="tinect"/><br /><sub><b>tinect</b></sub></a><br /><a href="#translation-seayko" title="Translation">🌍</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://crowdin.com/profile/Pusnow"><img src="https://crowdin-static.downloads.crowdin.com/avatar/13514833/small/65f0b45587cc7e34f2827830cd324b16.jpeg" width="40px;" alt="Wonsup Yoon"/><br /><sub><b>Wonsup Yoon</b></sub></a><br /><a href="#translation-Pusnow" title="Translation">🌍</a></td>
    <td align="center"><a href="https://crowdin.com/profile/zutt"><img src="https://crowdin-static.downloads.crowdin.com/avatar/13320003/small/50fdf9f8c7e54a446925bd79696ea625.JPG" width="40px;" alt="zutt"/><br /><sub><b>zutt</b></sub></a><br /><a href="#translation-zutt" title="Translation">🌍</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Backers via OpenCollective

<a href="https://opencollective.com/getferdi#section-contribute" target="_blank"><img src="https://opencollective.com/getferdi/backers.svg?width=890"></a>

## Sponsors via OpenCollective

<a href="https://opencollective.com/getferdi#section-contribute" target="_blank"><img src="https://opencollective.com/getferdi/sponsors.svg?width=890"></a>
