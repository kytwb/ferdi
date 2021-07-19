<p align="center">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href='#contributors-'><img src='https://img.shields.io/badge/contributors-97-default.svg?logo=github' alt='Contributors'/></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
    <a href="https://getferdi.com">
      <img src="./build-helpers/images/icon.png" alt="" width="250"/>
    </a>
</p>
<p align="center">
    <a href="https://getferdi.com/download">
      <img src="./branding/download.png" alt="Download" width="150"/>
    </a>
</p>

# Ferdi

<p align="center">
<img alt="GitHub Releases" src="https://img.shields.io/github/downloads/getferdi/ferdi/latest/total?label=Downloads&logo=iCloud&logoColor=%23FFFFFF">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href='#contributors-'><img src='https://img.shields.io/badge/contributors-90-default.svg?logo=github' alt='Contributors'/></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<a href="#backers-via-opencollective"><img alt="Open Collective backers" src="https://img.shields.io/opencollective/backers/getferdi?logo=open-collective"></a>
<a href="#sponsors-via-opencollective"><img alt="Open Collective sponsors" src="https://img.shields.io/opencollective/sponsors/getferdi?logo=open-collective"></a>
<a href="https://github.com/getferdi/ferdi/actions/workflows/ferdi-builds.yml"><img alt="Build Status" src="https://github.com/getferdi/ferdi/actions/workflows/ferdi-builds.yml/badge.svg?branch=develop&event=push"></a>
<a href="https://gitter.im/getferdi/community?utm_source=share-link&utm_medium=link&utm_campaign=share-link"><img alt="Gitter Chat Room" src="https://img.shields.io/gitter/room/getferdi/community"></a>
</p>

🤴🏽 Hard-fork of [Franz](https://github.com/meetfranz/franz), adding awesome features and removing unwanted ones.

## Table of contents

<details>
<summary>Toggle navigation</summary>

- [Ferdi](#ferdi)
  - [Table of contents](#table-of-contents)
  - [What is Ferdi?](#what-is-ferdi)
  - [Features](#features)
  - [What does Ferdi look like?](#what-does-ferdi-look-like)
  - [How to get and start using Ferdi](#how-to-get-and-start-using-ferdi)
    - [Download Ferdi](#download-ferdi)
    - [Or use Chocolatey (Windows only)](#or-use-chocolatey-windows-only)
    - [Or use Windows Package Manager (Windows only)](#or-use-windows-package-manager-windows-only)
    - [Or use homebrew (macOS or Linux)](#or-use-homebrew-macos-or-linux)
    - [Or use AUR (Arch Linux)](#or-use-aur-arch-linux)
  - [What makes Ferdi different from Franz?](#what-makes-ferdi-different-from-franz)
    - [Removes unproductive paywalls and other other interruptions](#removes-unproductive-paywalls-and-other-other-interruptions)
    - [Adds features to increase your productivity](#adds-features-to-increase-your-productivity)
    - [Adds features to improve your privacy](#adds-features-to-improve-your-privacy)
    - [Adds features to improve your experience using Ferdi](#adds-features-to-improve-your-experience-using-ferdi)
    - [Fixes bugs](#fixes-bugs)
    - [Adds new platforms](#adds-new-platforms)
    - [Adds internal changes](#adds-internal-changes)
  - [Contributing to Ferdi's development](#contributing-to-ferdis-development)
  - [Nightly releases](#nightly-releases)
  - [Troubleshooting recipes (self-help)](#troubleshooting-recipes-self-help)
  - [Contributors ✨](#contributors-)
  - [Backers via OpenCollective](#backers-via-opencollective)
  - [Sponsors via OpenCollective](#sponsors-via-opencollective)
  - [Other Sponsors](#other-sponsors)
</details>

## What is Ferdi?

Ferdi is a desktop app that helps you organize how you use your favourite apps by combining them into one application. It is based on Franz - a software already used by thousands of people - with the difference that Ferdi gives you many additional features and doesn't restrict its usage! Ferdi is compatible with your existing Franz account so you can continue right where you left off. Find out more about Ferdi and its features on [getferdi.com](https://getferdi.com).

## Features

- [x] Ferdi puts all your web apps into one place
- [x] Native support for 100+ services
- [x] Workspaces to keep your personal and work life separated
- [x] Support for multiple accounts on any service
- [x] Dark Mode support for all of your services
- [x] Optional cloud sync to keep your services synchronized between devices
- [x] Better control over when you get which notifications
- [x] Cross-platform so you can view your services on all your computers
- [x] Full proxy support to work in every network environment
- [x] Ferdi speaks your language: Support for 20+ languages

...and best of all:

- [x] Its completely free! There are no restrictions on features, no paywalls

## What does Ferdi look like?

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

## How to get and start using Ferdi

### Download Ferdi

You can download Ferdi for Windows, Mac and Linux on [Ferdi's download page](https://getferdi.com/download) or you can find all variants in the [latest stable release](https://github.com/getferdi/ferdi/releases/latest) assets and [all the other release here](https://github.com/getferdi/ferdi/releases).

### Or use Chocolatey (Windows only)

`$ choco install ferdi`

(Don't know Chocolatey? [chocolatey.org](https://chocolatey.org/))

### Or use Windows Package Manager (Windows only)

`$ winget install --id AmineMouafik.Ferdi`

(Don't know winget? [winget-cli](https://github.com/microsoft/winget-cli/))

### Or use homebrew (macOS or Linux)

`$ brew install --cask ferdi`

(Don't know homebrew? [brew.sh](https://brew.sh/))

### Or use AUR (Arch Linux)

Ferdi has three separate AUR packages you can use:

- **[ferdi](https://aur.archlinux.org/packages/ferdi/)**: Uses your system electron version to run the latest release - this version will work best on most systems.
- **[ferdi-bin](https://aur.archlinux.org/packages/ferdi-bin/)**: Uses the latest Fedora release and extracts it to Arch. Use this version if you are having trouble with the `ferdi` package.
- **[ferdi-git](https://aur.archlinux.org/packages/ferdi-git/)**: Uses your system electron version to run the latest commit from the develop branch and may be unstable but may also give you features that are not yet available in other versions. Please only use `ferdi-git` if you accept these risks.

If you use an AUR Helper e.g. yay, simply install it via `yay -S ferdi`.

## What makes Ferdi different from Franz?

### Removes unproductive paywalls and other other interruptions

- [x] Removes the counter-productive fullscreen app delay inviting users to upgrade
- [x] Removes pages begging you to donate after registration
- [x] Removes "Franz is better together" popup
- [x] Makes all users Premium by default ([#15](https://github.com/getferdi/ferdi/issues/15))

### Adds features to increase your productivity

- [x] Adds 30+ new services
- [x] Adds "Find in Page" feature ([#67](https://github.com/getferdi/ferdi/issues/67))
- [x] Adds an option to keep individual workspaces always loaded ([#37](https://github.com/getferdi/ferdi/issues/37))
- [x] Adds "Quick Switch" feature to help you navigate a long list of services (similar to Rambox's [Quick Switcher](https://rambox.pro/#feature-details/quick_switcher))
- [x] Adds "Service Hibernation" that will automatically unload services when they are unused to keep your computer running fast
- [x] Adds a setting to keep service in hibernation after startup ([#577](https://github.com/getferdi/ferdi/issues/577), [#584](https://github.com/getferdi/ferdi/issues/584))
- [x] [Add `user.css` and `user.js` that allows users to inject custom code into services](https://github.com/getferdi/ferdi/wiki/Using-user.css-and-user.js) ([#83](https://github.com/getferdi/ferdi/issues/83))
- [x] Adds Process Manager to find services using a lot of resources
- [x] Adds CTRL+← and CTRL+→ shortcuts and menu options to go back and forward in the service browsing history([#39](https://github.com/getferdi/ferdi/issues/39))
- [x] Adds "Scheduled Do-not-Disturb" feature in which you won't get notifications (similar to Rambox's [Work Hours](https://rambox.pro/#feature-details/work_hours))
- [x] Allows you to [use any Todo service inside "Franz Todo" panel](https://github.com/getferdi/ferdi/wiki/Custom-Todo) (e.g. Todoist via https://todoist.com/app) instead of being limited to using Franz Todo
- [x] Adds a dropdown list to choose your Todo service ([#418](https://github.com/getferdi/ferdi/issues/418), [#477](https://github.com/getferdi/ferdi/issues/477)), 💖 [@yourcontact](https://github.com/yourcontact)
- [x] Differentiates between indirect and direct notifications ([#590](https://github.com/getferdi/ferdi/issues/590)), 💖 [@Room4O4](https://github.com/Room4O4) [@mahadevans87](https://github.com/mahadevans87) [@FeikoJoosten](https://github.com/FeikoJoosten) [@sampathBlam](https://github.com/sampathBlam)

### Adds features to improve your privacy

- [x] [Adds option to change server to a custom](https://github.com/getferdi/ferdi/wiki/Custom-Server) [ferdi-server](https://github.com/getferdi/server)
- [x] Adds option to use Ferdi without an account ([#5](https://github.com/getferdi/ferdi/issues/5))
- [x] Uses the Ferdi API instead of Franz's servers
- [x] Adds "Private Notification"-Mode, that hides message content from notifications ([franz#879](https://github.com/meetfranz/franz/issues/879))
- [x] Adds Password Lock feature to keep your messages protected ([#41](https://github.com/getferdi/ferdi/issues/41), [franz#810](https://github.com/meetfranz/franz/issues/810), [franz#950](https://github.com/meetfranz/franz/issues/950), [franz#1430](https://github.com/meetfranz/franz/issues/1430))
- [x] Adds support for unlocking with Touch ID ([#367](https://github.com/getferdi/ferdi/issues/367))
- [x] Adds inactivity lock that automatically locks Ferdi after a specified amount of time ([#179](https://github.com/getferdi/ferdi/issues/179))
- [x] Adds local [recipe repository](https://github.com/getferdi/recipes) that removes the need of downloading recipes from a remote server

### Adds features to improve your experience using Ferdi

- [x] Adds Universal Dark Mode via the [DarkReader extension](https://github.com/darkreader/darkreader) ([#71](https://github.com/getferdi/ferdi/issues/71))
- [x] Adds Dark Reader settings ([#531](https://github.com/getferdi/ferdi/issues/531), [#568](https://github.com/getferdi/ferdi/issues/568)), 💖 [@Room4O4](https://github.com/Room4O4) & [@mahadevans87](https://github.com/mahadevans87)
- [x] Adds adaptable Dark Mode that will respect the system's Dark Mode setting ([#173](https://github.com/getferdi/ferdi/issues/173), [#548](https://github.com/getferdi/ferdi/issues/548) (💖 [@Room4O4](https://github.com/Room4O4) & [@mahadevans87](https://github.com/mahadevans87)))
- [x] Adds a hotkey to quickly toggle darkmode ([#530](https://github.com/getferdi/ferdi/issues/530), [#537](https://github.com/getferdi/ferdi/issues/537)), 💖 [@Room4O4](https://github.com/Room4O4) & [@mahadevans87](https://github.com/mahadevans87)
- [x] Adds an option to start Ferdi minimized ([#490](https://github.com/getferdi/ferdi/issues/490), [#534](https://github.com/getferdi/ferdi/issues/534))
- [x] Adds ability to change the services icons size and sidebar width ([#153](https://github.com/getferdi/ferdi/issues/153))
- [x] Adds an option to auto-hide the menubar ([#7](https://github.com/getferdi/ferdi/issues/7), [franz#833](https://github.com/meetfranz/franz/issues/833))
- [x] Enhances system tray icon behaviour ([#307](https://github.com/getferdi/ferdi/issues/307))
- [x] Adds option to show draggable window area on macOS ([#304](https://github.com/getferdi/ferdi/issues/304), [#532](https://github.com/getferdi/ferdi/issues/532))
- [x] Adds a notification & audio toggle action to the tray context menu ([#542](https://github.com/getferdi/ferdi/issues/542)), 💖 [@Room4O4](https://github.com/Room4O4) & [@mahadevans87](https://github.com/mahadevans87)
- [x] Adds option to show a browser-like navigation bar on all services
- [x] Adds option to change accent color
- [x] Reflects your currently opened service name to the window title to improve support for Password Managers ([#213](https://github.com/getferdi/ferdi/issues/213)), 💖 [@gmarec](https://github.com/gmarec)
- [x] Allows using SVGs for service custom icon
- [x] Adds button to open darkmode.css for a service
- [x] Improves "About Ferdi" screen to better display versions
- [x] Improves user onboarding ([#493](https://github.com/getferdi/ferdi/issues/493))
- [x] Improves "Updates" section in settings ([#506](https://github.com/getferdi/ferdi/issues/506)), 💖 [@yourcontact](https://github.com/yourcontact)
- [x] Improves draggable window area height for macOS ([#304](https://github.com/getferdi/ferdi/issues/304), [#479](https://github.com/getferdi/ferdi/issues/479))
- [x] Adds option to start Ferdi in system tray ([#331](https://github.com/getferdi/ferdi/issues/331)), 💖 [@jereksel](https://github.com/jereksel)
- [x] Fixes and enhances context menu ([#357](https://github.com/getferdi/ferdi/issues/357) [#413](https://github.com/getferdi/ferdi/issues/413) [#452](https://github.com/getferdi/ferdi/issues/452) [#354](https://github.com/getferdi/ferdi/issues/354) [#227](https://github.com/getferdi/ferdi/issues/227))
- [x] Adds better support for macOS dark mode
- [x] Adds option to disable reload of services after resuming Ferdi ([#442](https://github.com/getferdi/ferdi/issues/442)), 💖 [@n0emis](https://github.com/n0emis)
- [x] Comes with a custom branding proper to Ferdi
- [x] Adds better separation in settings
- [x] Adds various other UI improvements
- [x] Improves documentation of development so more developers can help making Ferdi even better
- [x] Updates Microsoft Teams to allow Desktop Sharing ([getferdi/recipes#116](https://github.com/getferdi/recipes/issues/116)), 💖 [@Gautasmi](https://github.com/Gautasmi)
- [x] Removes automatic reloading from WhatsApp

### Fixes bugs

- [x] Fixes bug that would incorrectly display unread messages count on some services (more info in [7566ccd](https://github.com/getferdi/ferdi/commit/7566ccd))
- [x] Fixes zooming
- [x] Fixes login problems in Google services
- [x] Fixes missing Slack services custom icons ([#290](https://github.com/getferdi/ferdi/issues/290))
- [x] Fixes bug that marked valid domains as invalid ([#276](https://github.com/getferdi/ferdi/issues/276))
- [x] Fixes microphone/camera access on some versions of macOS ([#193](https://github.com/getferdi/ferdi/issues/193))
- [x] Fixes cache clearing not working in Windows 10 ([#541](https://github.com/getferdi/ferdi/issues/541), [#544](https://github.com/getferdi/ferdi/issues/544)), 💖 [@Room4O4](https://github.com/Room4O4) & [@mahadevans87](https://github.com/mahadevans87)
- [x] Fixes Home button in navigation bar not correctly navigating ([#571](https://github.com/getferdi/ferdi/issues/571), [#573](https://github.com/getferdi/ferdi/issues/573)), 💖 [@Room4O4](https://github.com/Room4O4) & [@mahadevans87](https://github.com/mahadevans87)
- [x] Fixes notifications for various services, 💖 [@FeikoJoosten](https://github.com/FeikoJoosten)
- [x] Refocuses Webview only for active service ([#610](https://github.com/getferdi/ferdi/issues/610)), 💖 [@Room4O4](https://github.com/Room4O4) & [@mahadevans87](https://github.com/mahadevans87)

### Adds new platforms

- [x] Adds portable version for Windows so you can use Ferdi without even installing it, 💖 [@Makazzz](https://github.com/Makazzz)
- [x] Adds Arch Linux AUR packages, 💖 [@AGCaesar](https://github.com/AGCaesar)
- [x] Adds Ferdi as a Flatpak on Flathub ([#323](https://github.com/getferdi/ferdi/issues/323)), 💖 [@lhw](https://github.com/lhw)

### Adds internal changes

- [x] Upgrades to Electron 13.1.7
- [x] Switches to [`electron-spellchecker`](https://github.com/electron-userland/electron-spellchecker) to improve application size
- [x] Minifies build files to improve app size
- [x] Adds "npm run prepare-code" command for development to lint and beautify code
- [x] Adds "npm run link-readme" command to automatically add links to issues and users inside README.md
- [x] Fixes incorrect body closing tag ([#330](https://github.com/getferdi/ferdi/issues/330)), 💖 [@jereksel](https://github.com/jereksel)
- [x] Uses CrowdIn to improve i18n
- [x] Adds retry commands to flaky build steps ([#498](https://github.com/getferdi/ferdi/issues/498))
- [x] Runs utility scripts pre-commit instead of pre-push ([#515](https://github.com/getferdi/ferdi/issues/515))

> Thanks to all our [contributors](#contributors-) who helped realize all these amazing features! 💖

## Contributing to Ferdi's development

We welcome all contributors. Please read the [contributing guidelines](CONTRIBUTING.md) to setup your development machine and proceed.

## Nightly releases

Nightly releases are automatically triggered every day ([details](https://github.com/getferdi/ferdi/pull/990)) and available in [getferdi/nightlies](https://github.com/getferdi/nightlies/releases). Maintainers still need to manually publish the draft releases as pre-releases for now.

## Troubleshooting recipes (self-help)

One of the issues being raised by the awesome users of Ferdi is that certain service-functionalities do not work. As good example of this is either the unread count (badge) stops working for specific services or the gmail logins don't work anymore. (These are just 2 of the most common problems reported).

Since we (the contributors to Ferdi) also eat our own dog food, we use Ferdi as our day-to-day communication app - and most likely have faced the same/similar issue. As a first step before filing an issue, we request you to follow these simple steps to see if the issue gets fixed. These recipes will get automatically upgraded when you upgrade to the newer versions of Ferdi, but to get new recipes **between** Ferdi releases, this documentation is quite useful.

- Make sure you are on the latest version of Ferdi. As of this writing, since the nightly CI packaging process is broken, we request you to download the latest nightly from the link in [Nightly releases](#nightly-releases) section.
- Stop Ferdi
- Navigate to the Ferdi profile folder in your respective installation in your file explorer application.

```bash
  Mac: ~/Library/Application Support/Ferdi/recipes
  Windows: %appdata%/Ferdi/recipes
  Linux: ~/.config/Ferdi/recipes
```

- Delete the folder of the service that is causing your issue - _in the file explorer application_. (Please note that if you have manually modified any files here, it will be your responsibility to merge the changes with the latest version of the recipe (or you can submit a [pull request](https://github.com/getferdi/recipes/pulls) for the same).
- Open a browser and navigate to the [recipes](https://github.com/getferdi/recipes/tree/master/recipes) repository page, and copy ALL the files for your erroneous service into your local machine at the location that you deleted in the previous step
- Restart Ferdi (this should upgrade your recipes to the latest working version that the contributors have fixed)
- If this process did not fix the issue, please log a detailed bug report [here](https://github.com/getferdi/recipes/issues)
- _Note:_ An automated process to perform these steps is being ideated and tracked [here](https://github.com/getferdi/ferdi/issues/1302)

## Contributors ✨

Thanks goes to these awesome people:
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href='https://vantezzen.io' title='Bennett: code, design, doc, ideas, translation, example, bug, content, infra, userTesting, question, projectManagement, review'><img src='https://avatars2.githubusercontent.com/u/10333196?v=4' alt='vantezzen' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://twitter.com/kytwb' title='Amine Mouafik: code, design, doc, ideas, bug, content, infra, userTesting, question, projectManagement, review, maintenance, platform, fundingFinding, blog, translation'><img src='https://avatars0.githubusercontent.com/u/412895?v=4' alt='kytwb' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='http://www.adlk.io' title='Stefan Malzner: code, content, design, doc, ideas, infra, projectManagement, test, translation'><img src='https://avatars1.githubusercontent.com/u/3265004?v=4' alt='adlk' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/Makazzz' title='Makazzz: bug, code, translation, content, doc, platform'><img src='https://avatars2.githubusercontent.com/u/49844464?v=4' alt='Makazzz' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='http://seriesgt.com' title='ZeroCool: code, ideas'><img src='https://avatars3.githubusercontent.com/u/5977640?v=4' alt='ZeroCool940711' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/rseitbekov' title='rseitbekov: code'><img src='https://avatars2.githubusercontent.com/u/35684439?v=4' alt='rseitbekov' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://djangogigs.com/developers/peter-bittner/' title='Peter Bittner: ideas, bug'><img src='https://avatars2.githubusercontent.com/u/665072?v=4' alt='bittner' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/justus-saul' title='Justus Saul: bug, ideas'><img src='https://avatars1.githubusercontent.com/u/5861826?v=4' alt='justus-saul' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/igreil' title='igreil: ideas'><img src='https://avatars0.githubusercontent.com/u/17239151?v=4' alt='igreil' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='http://marcolopes.eu' title='Marco Lopes: ideas'><img src='https://avatars1.githubusercontent.com/u/431889?v=4' alt='marcolopes' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/dayzlun' title='dayzlun: bug'><img src='https://avatars3.githubusercontent.com/u/17259690?v=4' alt='dayzlun' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://twitter.com/tobigue_' title='Tobias Günther: ideas'><img src='https://avatars2.githubusercontent.com/u/1560152?v=4' alt='tobigue' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/AGCaesar' title='AGCaesar: platform'><img src='https://avatars3.githubusercontent.com/u/7844066?v=4' alt='AGCaesar' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/xthursdayx' title='xthursdayx: code, doc, infra, platform'><img src='https://avatars0.githubusercontent.com/u/18044308?v=4' alt='xthursdayx' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/Gaboris' title='Gaboris: question, bug'><img src='https://avatars2.githubusercontent.com/u/9462372?v=4' alt='Gaboris' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='http://www.cu3ed.com/' title='Ce: bug'><img src='https://avatars1.githubusercontent.com/u/61343?v=4' alt='incace' style='border-radius:42px;width:42px;height:42px;'/></a></td>
  </tr>
  <tr>
    <td align="center"><a href='http://pztrn.name/' title='Stanislav N.: bug'><img src='https://avatars1.githubusercontent.com/u/869402?v=4' alt='pztrn' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='http://www.patrickcurl.com' title='Patrick Curl: ideas'><img src='https://avatars1.githubusercontent.com/u/1470061?v=4' alt='patrickcurl' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/Stanzilla' title='Benjamin Staneck: design'><img src='https://avatars3.githubusercontent.com/u/75278?v=4' alt='Stanzilla' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/ammarmalhas' title='ammarmalhas: bug, security'><img src='https://avatars1.githubusercontent.com/u/57057209?v=4' alt='ammarmalhas' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/steliyan' title='Steliyan Stoyanov: code, ideas'><img src='https://avatars1.githubusercontent.com/u/1850292?v=4' alt='steliyan' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/brorbw' title='Bror Winther: doc'><img src='https://avatars2.githubusercontent.com/u/5909562?v=4' alt='brorbw' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://fwdekker.com/' title='Felix W. Dekker: doc'><img src='https://avatars0.githubusercontent.com/u/13442533?v=4' alt='FWDekker' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/Sauceee' title='Sauceee: design'><img src='https://avatars2.githubusercontent.com/u/17987941?v=4' alt='Sauceee' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='http://lhw.ring0.de' title='Lennart Weller: platform'><img src='https://avatars2.githubusercontent.com/u/351875?v=4' alt='lhw' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/jereksel' title='Andrzej Ressel: code'><img src='https://avatars0.githubusercontent.com/u/1307829?v=4' alt='jereksel' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://gitlab.com/dpeukert' title='Daniel Peukert: code'><img src='https://avatars2.githubusercontent.com/u/3451904?v=4' alt='dpeukert' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/Ali_Shiple' title='Ali M. Shiple: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/12895436/small/00917d09ca1b4b6d8e0ef36af07ecf6b.jpg' alt='Ali_Shiple' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/elviseras' title='elviseras: translation'><img src='https://www.gravatar.com/avatar/25c2cf0d8cb4a4141e71c3b8a2e9324f' alt='elviseras' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/J370' title='J370: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14141203/small/7b12b5db419d8796450221c2eaaf6003.png' alt='J370' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/keunes' title='Koen: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13018172/small/829115c606347b10218f34c637a2100c.png' alt='keunes' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/leandrogehlen' title='Leandro Gehlen: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14099621/small/1d9503523839c310dbce0af3c226e894.jpeg' alt='leandrogehlen' style='border-radius:42px;width:42px;height:42px;'/></a></td>
  </tr>
  <tr>
    <td align="center"><a href='https://crowdin.com/profile/Matthieu42' title='Matthieu42: translation'><img src='https://www.gravatar.com/avatar/735217ccccf11ba97573deee517ddb19' alt='Matthieu42' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/nicky18013' title='Nikita Bibanaev: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13468928/small/2b31e7ac19645d950a79b33ffd5721b8.png' alt='nicky18013' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/Tatjana1998' title='Tatjana1998: translation'><img src='https://www.gravatar.com/avatar/ade202a04fcbb2c177e4f1d9936af29e' alt='Tatjana1998' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/seayko' title='tinect: translation'><img src='https://www.gravatar.com/avatar/65e2aef738ddf828f822d8463fd04918' alt='seayko' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/Pusnow' title='Wonsup Yoon: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13514833/small/65f0b45587cc7e34f2827830cd324b16.jpeg' alt='Pusnow' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/zutt' title='zutt: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13320003/small/50fdf9f8c7e54a446925bd79696ea625.JPG' alt='zutt' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='http://twitter.com/noemis_exec' title='n0emis: code, translation'><img src='https://avatars3.githubusercontent.com/u/22817873?v=4' alt='n0emis' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://www.monke-agency.com/equipe.html' title='gmarec: code'><img src='https://avatars2.githubusercontent.com/u/3405028?v=4' alt='gmarec' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/127oo1' title='127oo1: translation'><img src='https://www.gravatar.com/avatar/060c722be11da16ae31902e9c98326b2' alt='127oo1' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/ChTBoner' title='ChTBoner: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13273153/small/a810886febf5199cfa1c98644444dea7.jpeg' alt='ChTBoner' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/johanengstrand' title='Johan Engstrand: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14152801/small/fd395f120efca971ca9b34c57fd02cca.png' alt='johanengstrand' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://mrassili.com' title='Marouane R: code'><img src='https://avatars0.githubusercontent.com/u/25288435?v=4' alt='mrassili' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/yourcontact' title='Roman: code, ideas'><img src='https://avatars2.githubusercontent.com/u/46404814?v=4' alt='yourcontact' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/mahadevans87' title='Mahadevan Sreenivasan: code, ideas, review, bug, doc, userTesting'><img src='https://avatars1.githubusercontent.com/u/1255523?v=4' alt='mahadevans87' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://jakelee.co.uk' title='Jake Lee: content'><img src='https://avatars2.githubusercontent.com/u/12380876?v=4' alt='JakeSteam' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/sampathBlam' title='Sampath Kumar Krishnan: code, review, ideas, bug, doc, userTesting'><img src='https://avatars1.githubusercontent.com/u/17728976?v=4' alt='sampathBlam' style='border-radius:42px;width:42px;height:42px;'/></a></td>
  </tr>
  <tr>
    <td align="center"><a href='https://github.com/saruwman' title='saruwman: doc, code'><img src='https://avatars2.githubusercontent.com/u/41330038?v=4' alt='saruwman' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/dorukkarinca' title='dorukkarinca: bug'><img src='https://avatars0.githubusercontent.com/u/9303867?v=4' alt='dorukkarinca' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://www.linkedin.com/in/gautamsi' title='Gautam Singh: code'><img src='https://avatars2.githubusercontent.com/u/5769869?v=4' alt='gautamsi' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://feikojoosten.com' title='Feiko Joosten: code'><img src='https://avatars0.githubusercontent.com/u/10920052?v=4' alt='FeikoJoosten' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/2bdelghafour' title='2bdelghafour: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14219410/small/31ff20f60d352fb46e314f3c180a77b0.jpeg' alt='2bdelghafour' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/abdoutanta' title='Abderrahim Tantaoui: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14213908/small/5b2fc8166f8a0a2b7313fbf49ee5b6b6.jpeg' alt='abdoutanta' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/AndiLeni' title='AndiLeni: translation'><img src='https://www.gravatar.com/avatar/4bd0da860de38afa735425ce2d4e10b5' alt='AndiLeni' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/brunofalmada' title='Bruno Almada: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14200540/small/f6f1addceeeabc02488f9b08520a902f.jpeg' alt='brunofalmada' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/Catarino' title='Catarino Gonçalo: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14208802/small/07287eb2de671257ca3d6bb4ba1cca67.jpeg' alt='Catarino' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/Alzemand' title='Edilson Alzemand Sigmaringa Junior: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14184269/small/f5e68247f01988ae7951a282f0fd4d06.jpeg' alt='Alzemand' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/MAT-OUT' title='MAT-OUT: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14201550/small/68dd2402bf2879bc3ca312d627710400.png' alt='MAT-OUT' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/mazzo98' title='mazzo98: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/12864917/small/69799b5fd7be2f67282715d5cdfd4ae1.png' alt='mazzo98' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/paprika-naught-tiffin-flyspeck' title='paprika-naught-tiffin-flyspeck: translation'><img src='https://www.gravatar.com/avatar/8671ebe7a7164dfa7624fbdbff69ed96' alt='paprika-naught-tiffin-flyspeck' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/patrickvalle' title='Patrick Valle: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14217484/small/8b73f313ee79fe33625e819cdac86551.jpg' alt='patrickvalle' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/peq42' title='peq42_: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14155811/small/b62a94dde7ec29948ec6a6af9fd24b1d.png' alt='peq42' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/karlinhos' title='Pumbinha: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14161139/small/96450eb44c22b3141ab4401e547109b8.png' alt='karlinhos' style='border-radius:42px;width:42px;height:42px;'/></a></td>
  </tr>
  <tr>
    <td align="center"><a href='https://crowdin.com/profile/dies' title='Serhiy Dmytryshyn: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/1/small/e84bcdf6c084ffd52527931f988fb410.png' alt='dies' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/SMile61' title='SMile61: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14177585/small/1bb4f6ba39bff3df8f579e61460ce016.png' alt='SMile61' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://crowdin.com/profile/tinect' title='tinect: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/12521988/small/56c2041645746af9e51dd28782b828c3.jpeg' alt='tinect' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/gega7' title='gega7: bug'><img src='https://avatars0.githubusercontent.com/u/20799911?v=4' alt='gega7' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/tristanplouz' title='tristanplouz: code, ideas'><img src='https://avatars2.githubusercontent.com/u/6893466?v=4' alt='tristanplouz' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/dannyqiu' title='Danny Qiu: code, bug'><img src='https://avatars1.githubusercontent.com/u/1170755?v=4' alt='dannyqiu' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/belyazidi56' title='Youssef Belyazidi: code'><img src='https://avatars3.githubusercontent.com/u/35711540?v=4' alt='belyazidi56' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/gabspeck' title='Gabriel Speckhahn: platform'><img src='https://avatars2.githubusercontent.com/u/749488?v=4' alt='gabspeck' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/dandelionadia' title='Nadiia Ridko: code'><img src='https://avatars0.githubusercontent.com/u/33199975?v=4' alt='dandelionadia' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://hohner.dev' title='Jan Hohner: userTesting'><img src='https://avatars0.githubusercontent.com/u/649895?v=4' alt='janhohner' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://marussy.com' title='Kristóf Marussy: code, maintenance, review'><img src='https://avatars1.githubusercontent.com/u/38888?v=4' alt='kris7t' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://cl.linkedin.com/in/juanvalentinmoraruiz' title='Juan Mora: code'><img src='https://avatars0.githubusercontent.com/u/4575267?v=4' alt='raicerk' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://tofran.com' title='Francisco Marques: code'><img src='https://avatars2.githubusercontent.com/u/5692603?v=4' alt='tofran' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://digitalcoyote.github.io/NuGetDefense/' title='Curtis Carter: platform'><img src='https://avatars3.githubusercontent.com/u/16868093?v=4' alt='digitalcoyote' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/kawarimidoll' title='カワリミ人形: doc'><img src='https://avatars0.githubusercontent.com/u/8146876?v=4' alt='kawarimidoll' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://immortal-pc.info/' title='1mm0rt41PC: code'><img src='https://avatars0.githubusercontent.com/u/5358076?v=4' alt='1mm0rt41PC' style='border-radius:42px;width:42px;height:42px;'/></a></td>
  </tr>
  <tr>
    <td align="center"><a href='http://code-addict.pl' title='Michał Kostewicz: code'><img src='https://avatars.githubusercontent.com/u/6313392?v=4' alt='k0staa' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://www.linkedin.com/in/yogainformatika/' title='Yoga Setiawan: code, platform'><img src='https://avatars.githubusercontent.com/u/1139881?v=4' alt='arioki1' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/MosheGross' title='Moshe Gross: code'><img src='https://avatars.githubusercontent.com/u/77084755?v=4' alt='MosheGross' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/stnkl' title='Stephan Rumswinkel: code'><img src='https://avatars.githubusercontent.com/u/17520641?v=4' alt='stnkl' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/vraravam' title='Vijay Raghavan Aravamudhan: maintenance, doc, code, mentoring, review, infra, ideas, bug, content, userTesting, projectManagement'><img src='https://avatars.githubusercontent.com/u/69629?v=4' alt='vraravam' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://dustin.meecolabs.eu/' title='Dustin: design'><img src='https://avatars.githubusercontent.com/u/124467?v=4' alt='alopix' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/jakobsudau' title='Jakob Felix Julius Sudau: design'><img src='https://avatars.githubusercontent.com/u/721715?v=4' alt='jakobsudau' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://prasans.info' title='Prasanna: code'><img src='https://avatars.githubusercontent.com/u/380340?v=4' alt='prasann' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/markandan' title='Markandan R: code'><img src='https://avatars.githubusercontent.com/u/7975763?v=4' alt='markandan' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://markushatvan.com' title='Markus Hatvan: code'><img src='https://avatars.githubusercontent.com/u/16797721?v=4' alt='mhatvan' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://sergiu.dev/' title='Sergiu Ghitea: code'><img src='https://avatars.githubusercontent.com/u/28300158?v=4' alt='sergiughf' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/ArviTheMan' title='ArviTheMan: doc'><img src='https://avatars.githubusercontent.com/u/73516201?v=4' alt='ArviTheMan' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://bandism.net/' title='Ikko Ashimine: code'><img src='https://avatars.githubusercontent.com/u/22633385?v=4' alt='eltociear' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/madsmtm' title='Mads Marquart: translation'><img src='https://avatars.githubusercontent.com/u/10577181?v=4' alt='madsmtm' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='http://mateusz.loskot.net/' title='Mateusz Łoskot: doc'><img src='https://avatars.githubusercontent.com/u/80741?v=4' alt='mloskot' style='border-radius:42px;width:42px;height:42px;'/></a></td>
    <td align="center"><a href='https://github.com/skoshy' title='Stefan K: doc'><img src='https://avatars.githubusercontent.com/u/369825?v=4' alt='skoshy' style='border-radius:42px;width:42px;height:42px;'/></a></td>
  </tr>
  <tr>
    <td align="center"><a href='https://github.com/graves501' title='graves501: doc'><img src='https://avatars.githubusercontent.com/u/11211125?v=4' alt='graves501' style='border-radius:42px;width:42px;height:42px;'/></a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Backers via OpenCollective

<a href="https://opencollective.com/getferdi#section-contribute" target="_blank"><img src="https://opencollective.com/getferdi/backers.svg?width=890"></a>

Mention to the individuals backing us via [GitHub Sponsors](https://github.com/sponsors/getferdi) as well.

## Sponsors via OpenCollective

<a href="https://opencollective.com/getferdi#section-contribute" target="_blank"><img src="https://opencollective.com/getferdi/sponsors.svg?width=890"></a>

## Other Sponsors

<p>
  <a href="https://www.digitalocean.com/">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px">
  </a>
</p>
<p>
  <a href="https://www.parallels.com/">
    <img src="https://user-images.githubusercontent.com/412895/87706297-3025e380-c797-11ea-94c4-bf8414b0b5ab.png" height="32px">
  </a>
</p>
