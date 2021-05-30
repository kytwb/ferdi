# [5.6.0-beta.6](https://github.com/getferdi/ferdi/compare/v5.6.0-beta.5...v5.6.0-beta.6) (2021-05-31)

### Features
- Add new setting to minimize to tray when closing on Windows (#1087) 💖 @1mm0rt41PC
- Add Search with Google and DuckDuckGo items in the context menu 💖 @MosheGross, @vraravam
- Add support for Apple M1 💖 @arioki1, @vraravam
- Enchance Quick switch with fuzzy search and highlighting (#1311) (#1319) 💖 @vraravam
- Alternative shortcuts for Quick switch (#850) 💖 @kris7t
- Add Back, Forward, Open, and Copy to clipboard items in browser context menu 💖 @vraravam
- Add Copy to clipboard item for blob images on macOS 💖 @vraravam
- Add MSI installer for Windows (#1443) 💖 @vraravam

### Minor changes
- Display search input when service is not found 💖 @arioki1
- Expose Electron version information in "About Ferdi" (#1109) 💖 @vraravam
- Add delete service confirmation (#1286) 💖 @vraravam
- Add macOS Big Sur icon (#1056) (#1100) 💖 @alopix @jakobsudau
- Improve custom accent color design 💖 @kris7t
- Improve performance on Setting screen with large cache size 💖 @kris7t
- Automatically fill in default service URL (#1436) 💖 @vraravam
- Installation instructions for winget-cli 💖 @mloskot
- Improve screen sharing selector appearance and add screen sharing cancellation

### Recipes
- Add 14 new recipes! Intercom, Infomaniak Mail, Clockify, BiP, Azure DevOps, Canvas, Webex Teams, Erepublik, Kimai, Snapdrop, Amazon WorkMail, Google Contacts, Harvest, Inoreader 💖 @guillaume-ro-fr, @bidouilles, @sysuin, @arioki1, @BilelJegham, @Sagir-mo, @rbertoncelj, @kevinpapst, @vraravam, @annagrram
- Update Google Calendar icon 💖 @jobo90
- Fix WhatsApp unread message counter 💖 @bpwned, @TheBoroer
- Synchronize Outlook services and correct message count 💖 @cromefire
- Fix null element error in Protonmail 💖 @mmso
- Update URL for Telegram React 💖 @RoiArthurB
- Update Zulip logo and contact details 💖 @adambirds
- Fix Element unread message count 💖 @fjl5
- Fix Google Chat image previews (#1283) 💖 @vraravam
- Fix non-SSO login for Google services (#1273) (#1283) 💖 @vraravam
- Update Gmail icon (getferdi/recipes#349) 💖 @vraravam
- Fix Gitter unread message count 💖 @vraravam
- Fix Hangouts Chat unread message count (getferdi/recipes#102) (getferdi/recipes#485) 💖 @vraravam
- Add self-hosted URL support for Office 365 (getferdi/recipes#500) 💖 @vraravam
- Fix login redirect in PushBullet (#1331) 💖 @vraravam
- Fix Mattermost unread count (#1110) 💖 @kemenaran
- Add self-hosted URL support for Jitsi (#1228) 💖 @vraravam
- Add self-hosted URL support for Jira (#1169) 💖 @vraravam
- Fix Messenger unread count (#1113) 💖 @vraravam
- Fix Zulip unread count (#1362) 💖 @vraravam
- Fix Telegram React unread count 💖 @vraravam

### Fixes
- Fix installation instructions for Homebrew (#1143) 💖 @kawarimidoll
- Show username and lastname fetched from server in account settings (#1040) 💖 @k0staa
- Fix "Service Developer Tools not available" (#147) 💖 @arioki1
- Fix window unsnapping when clicking notification (#896) 💖 @stnkl
- Fix spellchecker language saving (#1016)
- Fix typo in the Login screen 💖 @eltociear
- Fix typo in README.md 💖 @graves501
- Fix "Show Ferdi In Menu Bar" nomenclature on macOS (#1417) 💖 @vraravam

### Under the hood
- Update to Electron 13.0.1 💖 @vraravam, @kris7t
- Update dependencies 💖 @vraravam, @kris7t
- Synchronize with Ferdi 5.6.0 💖 @vraravam
- Add Docker containers for building in Linux and development with VSCode 💖 @vraravam

# [5.6.0-beta.5](https://github.com/getferdi/ferdi/compare/v5.6.0-beta.2...v5.6.0-beta.5) (2020-12-20)

### Features
- Add FAB to service dashboard (#824)
- Add "Go to Home Page" in services context menu (#900) 💖 @raicerk
- Add vertical style and "Always show workspace drawer" setting (#567)
- Flash TaskBar (Windows) / Bounce Dock (Mac) on New Message (#1020) 💖 @mahadevans87
- Add danish translations 💖 @madsmtm

### Minor changes
- Update dependencies
- Add Norwegian translations (#840) 💖 @larsmagnusherland
- Update adaptable dark mode to work on all platforms (#834)
- Improved onboarding flow and settings empty states (#996) 💖 @tofran
- Enhance the "Support Ferdi" screen (#722) 💖 @yourcontact
- Improve Ferdi's design (#977)

### Recipes
- Add 24 new recipes! Nextcloud, Nextcloud Cospend, Nextcloud Tasks, StackExchange, Noisli, Yahoo Mail, TickTick, DevDocs, Figma, iCloud Reminders, OneNote, YouTrack, SimpleNote, Lark, Slite, Pinterest, Disqus, Microsoft Todo, Google Podcasts, YouTube Music, Sync.com, Wire, Fleep, Google Classroom 💖 @eandersons, @kittywhiskers, @andrsussa, @vraravam, @arioki1, @hongshaoyang, @tofran, @stephenpapierski, @marcolussetti, @alopix, @iansearly, @TanZng
- Fix connection error in case of audio/video call in Google Meet (getferdi/recipes#186) 💖 @Room4O4
- Fix Wrike notification counter (getferdi/recipes#237) 💖 @mvdgun
- Update recipe for element (getferdi/recipes#247) 💖 @fjl5
- Add support for empty unread badges in WhatsApp (getferdi/recipes#236) 💖 @ruippeixotog
- Add custom URLs for Jira (getferdi/recipes#217) 💖 @yann-soubeyrand
- Fixing unread-counter for office365 (getferdi/recipes#229) 💖 @CrEaK
- Mattermost: Fix badge for unread channels when in single team (getferdi/recipes#230) 💖 @CrEaK
- Update Riot.im to Element.io (getferdi/recipes#235) 💖 @omove
- Fix whatsapp fullscreen for different screen sizes (getferdi/recipes#216) 💖 @breuerfelix
- Changed gmail getMessages to grab value next to Inbox 💖 @stephenpapierski
- Fix Gmail getMessages produces wrong value 💖 @stephenpapierski
- Update Hangouts Chat to display direct and indirect notifications (#306) 💖 @mahadevans87
- Update user agent for OWA and Outlook (#302) 💖 @StormPooper
- Updated Zoho icons 💖 @tofran
- Spoof Chrome plugins for Skype 💖 @kris7t
- More careful Gmail unread count detection 💖 @kris7t
- Update Todoist notifications badge selector (#333) (#334) 💖 @rvisharma
- Fix messages count for Fastmail (#335) (#336) 💖 @marcolussetti
- Fix Zoho Mail 💖 @pointergr
- Add notification count for Habitica 💖 @iansearly

### Fixes
- Fix Electron 9 crash on Windows 10 (#986) 💖 @mahadevans87
- Patch getDisplayMedia for screen sharing in all services (#802)
- Fix "Open folder" button on "Custom services" screen (#991)

### Under the hood
- Update to Electron 9
- Remove Ferdi string from default user agent (#806) 💖 @dannyqiu
- Add recipes packaging to development setup (#985)
- Use imagemin to minify images (#1008) 💖 @vraravam
- Disable Chromium's poor MPRIS implementation (#1023)

# [5.6.0-beta.2](https://github.com/getferdi/ferdi/compare/v5.5.0...v5.6.0-beta.2) (2020-06-14)

### Features
- Make the notifications badge work with LauncherAPI-compliant (#736) 💖 @gabspeck

### Minor changes
- Update node-sass to 4.14.0 for compatibility with Node 14.x (#656) 💖 @dpeukert
- Change Keyboard shortcut tooltip text in Sidebar for Settings (#665) 💖 @sampathBlam
- Restore "delete service" option in sidebar (#692) 💖 @sampathBlam
- Add Google Tasks to Todo providers (#695) 💖 @dannyqiu
- Restore window last closed maximize/fullscreen state (#733) 💖 @dannyqiu
- Add password hashing to lock password (#694)
- Close/open window when clicking on tray menu item (#630) 💖 @dandelionadia
- Use Tray popUpContextMenu on macOS/Windows only (#741)
- Setup nightly releases deployment pipeline (#730)
- Make Tray icons more robust on Linux (#748) 💖 @kris7t
- Load disable hibernation per service status on startup (#754) 💖 @kris7t
- Update global user agent to conform with spec (#779) 💖 @dannyqiu

### Bug Fixes
- Prevent unnecessary electron popup windows for links (#685) 💖 @mahadevans87
- Refactor locking feature (#693)
- Review launch on startup for macOS, start Ferdi app, not renderer (#696) 💖 @dannyqiu
- Fix TodosWebview user agent (#713) 💖 @mahadevans87
- Fix crash when using Password Lock with TouchID API unavailable (#737) 💖 @mahadevans87
- Fix setting of webview disablewebsecurity attribute (#772) 💖 @dannyqiu

# [5.5.0](https://github.com/getferdi/ferdi/compare/v5.4.3...v5.5.0) (2020-04-26)
### Features
- Merge Franz 5.5.0-beta.2
- Add modifyRequestHeaders, enable properly setting headers for services (#639), 💖 @mahadevans87 @sampathBlam 
- Add dropdown list to choose Todo service (#418, #477), 💖 @yourcontact
- Add hotkey for darkmode (#530, #537), 💖 @Room4O4 & @mahadevans87
- Add option to start Ferdi minimized (#490, #534)
- Add option to show draggable window area on macOS (#304, #532)
- Add support for Adaptable Dark Mode on Windows (#548), 💖 @Room4O4 & @mahadevans87
- Add notification & audio toggle action in tray context menu (#542), 💖 @Room4O4 & @mahadevans87
- Add Dark Reader settings (#531, #568), 💖 @Room4O4 & @mahadevans87
- Add support for 11 new services and improve existing ones, 💖 @rctneil @JakeSteam @sampathBlam @tpopela @RoiArthurB
- Add support for unlocking with Touch ID (#367)
- Add find in page feature (#67) (#432)
- Add custom dark mode handler support (#445)
- Add option to disable reload after resume (#442), 💖 @n0emis
- Add custom JS/CSS to services (#83)
- Add ability to change the services icons size and sidebar width (#153)
- Differentiate between indirect and direct notifications (#590), 💖 @Room4O4 @mahadevans87 @FeikoJoosten @sampathBlam
- Add setting to keep service in hibernation after startup (#577, #584)

### Minor changes
- Improve user onboarding (#493)
- Improve "Updates" section in settings (#506), 💖 @yourcontact
- Improve information about Franz Premium and Teams
- Hide user lastname on Ferdi servers as it is not stored
- Improve draggable window area height for macOS (#304, #479)
- Remove server setting from settings screen (#516), 💖 @mrassili
- Update Electron to 8.1.1 (#480)
- Window title now reflects service name (#213), 💖 @gmarec
- Improve system tray icon behaviour (#307)
- Improve navigation bar behaviour setting (#270)
- Ferdi is now available as Flatpak on Flathub (#323), 💖 @lhw
- Add automatic local recipe updates
- Add option to start Ferdi in system tray (#331), 💖 @jereksel 
- Add better support for macOS dark mode
- Add better seperation in settings
- Change Sentry telemetry to be opt-in only (#160)
- Remove excess code from Franz's hibernate feature (#609)
- Refocus Webview only for active service (#610), 💖 @Room4O4 & @mahadevans87
- Use GitHub notifications center and direct notifications (getferdi/recipes#133)
- Switch back to original Telegram, add Telegram React (getferdi/recipes#132)
- Fix notifications for various services, 💖 @FeikoJoosten
- Add support for indirect messages for various services, 💖 @FeikoJoosten
- Use correct Riot icon (getferdi/recipes#125), 💖 @halms
- Remove incorrectly placed icons (getferdi/recipes#126), 💖 @halms
- Fix slack draft notifications (getferdi/recipes#127), 💖 @Serubin
- Remove automatic reloading from WhatsApp
- Update Microsoft Teams to allow Desktop Sharing (getferdi/recipes#116), 💖 @Gautasmi
- Organize settings with horizontal tabs (#569), 💖 @yourcontact
- Improve cache clearing UI feedback (#620), 💖 @saruwman

### Bug fixes
- Fix cache clearing not working in Windows 10 (#541, #544), 💖 @Room4O4 & @mahadevans87
- Fix Home button in navigation bar not correctly navigating (#571, #573), 💖 @Room4O4 & @mahadevans87
- Fix and enhance context menu (#357) (#413) (#452) (#354) (#227)
- Fix regresssion around muting services (#428), 💖 @dpeukert
- Fix app unusable without an account on Windows since v5.4.0 (#253)
- Fix services URL validation/harmonization (#276)
- Fix app failing to properly lock itself at startup resulting in shortcuts not working (#377) (#362)
- Fix shortcuts not working when locked (#404)
- Fix missing Slack services custom icons (#290)
- Fix app possibly unusable when using faulty translations (#340)
- Fix Dark Mode setting on Windows (#347)
- Fix login problems in Google services
- Fix Dark Reader blocking services from loading (#285)
- Fix incorrect body closing tag (#330), 💖 @jereksel
- Fix DarkReader translation problem (#593)
- Fix system tray icon tooltip text (#648), 💖 @sampathBlam
- Enable Dark Reader settings to follow the accent color (#646), 💖 @sampathBlam

### Build changes
- Add retry commands to flaky build steps (#498)
- Run utility scripts pre-commit instead of pre-push (#515)
- Sign Windows binaries (#635, #633, #112)

# [5.5.0-gm.2](https://github.com/getferdi/ferdi/compare/v5.5.0-gm...v5.5.0-gm.2) (2020-04-23)
### Features
- Differentiate between indirect and direct notifications (#590), 💖 @Room4O4 @mahadevans87 @FeikoJoosten @sampathBlam
- Add setting to keep service in hibernation after startup (#577, #584)

### Minor changes
- Remove excess code from Franz's hibernate feature (#609)
- Refocus Webview only for active service (#610), 💖 @Room4O4 & @mahadevans87
- Use GitHub notifications center and direct notifications (getferdi/recipes#133)
- Switch back to original Telegram, add Telegram React (getferdi/recipes#132)
- Fix notifications for various services, 💖 @FeikoJoosten
- Add support for indirect messages for various services, 💖 @FeikoJoosten
- Use correct Riot icon (getferdi/recipes#125), 💖 @halms
- Remove incorrectly placed icons (getferdi/recipes#126), 💖 @halms
- Fix slack draft notifications (getferdi/recipes#127), 💖 @Serubin
- Remove automatic reloading from WhatsApp
- Update Microsoft Teams to allow Desktop Sharing (getferdi/recipes#116), 💖 @Gautasmi
- Organize settings with horizontal tabs (#569), 💖 @yourcontact
- Improve cache clearing UI feedback (#620), 💖 @saruwman

### Bug Fixes
- Fix DarkReader translation problem (#593)

## [5.5.0-gm](https://github.com/getferdi/ferdi/compare/v5.4.4-beta.3...v5.5.0-gm) (2020-04-19)
### Features
- Merge Franz 5.5.0-beta.2
- Add dropdown list to choose Todo service (#418, #477), 💖 @yourcontact
- Add hotkey for darkmode (#530, #537), 💖 @Room4O4 & @mahadevans87
- Add option to start Ferdi minimized (#490, #534)
- Add option to show draggable window area on macOS (#304, #532)
- Add support for Adaptable Dark Mode on Windows (#548), 💖 @Room4O4 & @mahadevans87
- Add notification & audio toggle action in tray context menu (#542), 💖 @Room4O4 & @mahadevans87
- Add Dark Reader settings (#531, #568), 💖 @Room4O4 & @mahadevans87
- Add support for 11 new services and improve existing ones, 💖 @rctneil @JakeSteam @sampathBlam @tpopela @RoiArthurB

### Minor changes
- Improve user onboarding (#493)
- Improve "Updates" section in settings (#506), 💖 @yourcontact
- Improve information about Franz Premium and Teams
- Improve user scripts (#559)
- Hide user lastname on Ferdi servers as it is not stored
- Improve draggable window area height for macOS (#304, #479)
- Remove server setting from settings screen (#516), 💖 @mrassili
- Update Electron to 8.1.1 (#480)

### Bug fixes
- Fix cache clearing not working in Windows 10 (#541, #544), 💖 @Room4O4 & @mahadevans87
- Fix Home button in navigation bar not correctly navigating (#571, #573), 💖 @Room4O4 & @mahadevans87

### Build changes
- Add retry commands to flaky build steps (#498)
- Run utility scripts pre-commit instead of pre-push (#515)

# [5.4.3](https://github.com/getferdi/ferdi/compare/v5.4.0...v5.4.3)
### Features
- Add inactivity lock #179

### Minor changes
- Upgrading to Electron 7 https://github.com/getferdi/ferdi/issues/170
- Review empty lock password behaviour https://github.com/getferdi/ferdi/issues/232
- Several minor UI improvements
- Add several new services
- Better handling of (adaptable/universal) dark mode eff719b87c60097342d393922048662c32255d88
- Enhance icon file for better rendering on Windows #272
- Add auto-focus on lock screen password field #269
- Allow SVG mimetype for service custom icon #271
- Add multisize tray icon for Windows (#316)

### Bug fixes
- Fix bypass flaw in lock feature https://github.com/getferdi/ferdi/issues/168
- Fix spellchecker by using setTimeout https://github.com/getferdi/ferdi/issues/220
- Fix zoom +/- in services https://github.com/getferdi/ferdi/issues/143
- Fix microphone/camera access on some versions of macOS #193
- Fix bugs with using Ferdi without an account

### Build changes
- Extended Travis build time from 30 to 100 minutes

# [5.4.0](https://github.com/getferdi/ferdi/compare/v5.3.4...v5.4.0)
- Merge Franz v5.4.0
- Add option to show a service navigation bar
- Add service hibernation
- Minifying build files to improve app size
- Switching to `electron-spellchecker` for improved spellchecking
- Add button to open darkmode.css for a service
- Add option to change accent color
- Fix universal darkmode for WhatsApp and Threema
- Sorting applications in QuickSwitch by last used

# [5.3.4](https://github.com/getferdi/ferdi/compare/v5.3.3...v5.3.4) (2019-09-25)
- Fix continuous releases/assets delivery on tags builds #53
- Attempt at making menubar hiding feature cross-platform #7 (comment)
- Attempt at making "About Ferdi" consistent across platforms #47 (comment)
- Attempt at fixing "Launch on start" feature on Linux #63
- Add "Quick Switch" feature
- Add universal Dark-Mode via the [Dark Reader extension](https://github.com/darkreader/darkreader)
- Add "Scheduled Do-not-Disturb" feature

# [5.3.3](https://github.com/getferdi/ferdi/compare/v5.3.2...v5.3.3) (2019-09-18)
- Merged Franz v5.3.3 into Ferdi
- Allow hiding menubar (#7)
- Add "back" and "forward" options for browsing history inside services (#39)
- Add password protection feature (#41)
- Add keep workspace loaded option per workspace (#37)

# [5.3.2](https://github.com/getferdi/ferdi/compare/v5.3.1...v5.3.2) (2019-09-13)
Merged Franz v5.3.2 into Ferdi

## [5.3.1](https://github.com/getferdi/ferdi/compare/v5.3.0...v5.3.1) (2019-09-09)
Merge Franz v5.3.1 into Ferdi.

- Enable todos for all users
- Fix WhatsApp recipe not working (#19 and #21)

### Bug Fixes

* **Windows:** Fix app size in fullscreen ([e210701](https://github.com/getferdi/ferdi/commit/e210701))
* **Windows:** Fix app to be cropped at the bottom on Windows ([42f97b4](https://github.com/getferdi/ferdi/commit/42f97b4))


### Features

* **Todos:** Add option to disable todos ([5d03b91](https://github.com/getferdi/ferdi/commit/5d03b91))


## [5.3.0](https://github.com/getferdi/ferdi/compare/v5.2.1-beta.1...v5.3.0) (2019-09-06)
- Removes pages begging you to donate after registration
- Makes all users Premium by default
- [Add option to change server to a custom](https://github.com/getferdi/ferdi#servers) [ferdi-server](https://github.com/getferdi/server)
- Remove "Franz is better together" popup
- Makes RocketChat self-hosted generally available
- Comes with a custom branding proper to Ferdi

## [5.2.1-beta.1](https://github.com/meetfranz/franz/compare/v5.2.0...v5.2.1-beta.1) (2019-07-30)

### Features

* **App:** Add second confirmation step for the free 14 day trial.
* **Todos:** Add option to disable todos ([5d03b91](https://github.com/meetfranz/franz/commit/5d03b91))

# [5.3.0](https://github.com/meetfranz/franz/compare/v5.2.1-beta.1...v5.3.0) (2019-09-06)

### Features

* **Todos:** 🥳🥳🥳 Manage your daily tasks with **Franz Todos** 🥳🥳🥳
* **App:** Add option to copy debug information via the help menu ([4666e85](https://github.com/meetfranz/franz/commit/4666e85))
* **App:** Updated Pricing, more infos can be found on  ([meetfranz.com/pricing](https://meetfranz.com/pricing))
* **App:** Improved Settings UX
* **3rd Party Services:** Added option to open custom recipes folder


### Bug Fixes

* **Windows:** Fix app size in fullscreen ([e210701](https://github.com/meetfranz/franz/commit/e210701))
* **Windows:** Fix app to be cropped at the bottom on Windows ([42f97b4](https://github.com/meetfranz/franz/commit/42f97b4))
* **Notifications:** Fix issue that blocked notifications from e.g. Slack ([44c413b](https://github.com/meetfranz/franz/commit/44c413b))
* **App:** A ton of various bugfixes and improvements

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**


# [5.2.0](https://github.com/meetfranz/franz/compare/v5.2.0-beta.4...v5.2.0) (2019-07-19)

### Features
* **Service:** You can now add any custom website 🥳

### Bug Fixes

* **Notifications:** Don't show notification badges when app is muted ([e844a64](https://github.com/meetfranz/franz/commit/e844a64))
* **Settings:** Fix position of settings window
* **Recipes:** Fix recipe install when directly accessing recipe e.g. via url ([eba50bc](https://github.com/meetfranz/franz/commit/eba50bc))
* **Proxy:** Fix issue with service proxy authentication ([b9e5b23](https://github.com/meetfranz/franz/commit/b9e5b23))
* **Announcements:** Fix issue with rendering announcements in workspaces ([1e38ec5](https://github.com/meetfranz/franz/commit/1e38ec5))
* **Windows:** Add Workspaces menu & fix Window menu ([92a61d4](https://github.com/meetfranz/franz/commit/92a61d4))
* **Windows:** Replace tray icon with high-res version ([a5eb399](https://github.com/meetfranz/franz/commit/a5eb399))
* **Workspaces:** Fix service reordering within workspaces ([17f3a22](https://github.com/meetfranz/franz/commit/17f3a22))
* **Workspaces:** Fix issue with service visibility after downgrade ([05294](https://github.com/meetfranz/franz/commit/05294))

### General
* **App:** Improved email validation ([dd8ddcc](https://github.com/meetfranz/franz/commit/dd8ddcc)) ([@Snuggle](https://github.com/Snuggle))
* **App:** Update electron to 4.2.4 ([404c87a](https://github.com/meetfranz/franz/commit/404c87a))
* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**


# [5.2.0-beta.4](https://github.com/meetfranz/franz/compare/v5.2.0-beta.3...v5.2.0-beta.4) (2019-07-01)


### Bug Fixes

* **Notifications:** Don't show notification badges when app is muted ([e844a64](https://github.com/meetfranz/franz/commit/e844a64))
* **Settings:** Fix position of settings window

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**


# [5.2.0-beta.3](https://github.com/meetfranz/franz/compare/v5.2.0-beta.2...v5.2.0-beta.3) (2019-06-24)

### General

* **App:** Downgraded electron to 4.2.4 ([404c87a](https://github.com/meetfranz/franz/commit/404c87a))


# [5.2.0-beta.2](https://github.com/meetfranz/franz/compare/v5.2.0-beta.1...v5.2.0-beta.2) (2019-06-12)


### Bug Fixes

* **Recipes:** Fix recipe install when directly accessing recipe ([eba50bc](https://github.com/meetfranz/franz/commit/eba50bc))



# [5.2.0-beta.1](https://github.com/meetfranz/franz/compare/v5.1.0...v5.2.0-beta.1) (2019-06-11)


### Bug Fixes

* **Workspaces:** Service reordering within workspaces ([17f3a22](https://github.com/meetfranz/franz/commit/17f3a22))
* **Proxy:** Fix issue with proxy authentication ([b9e5b23](https://github.com/meetfranz/franz/commit/b9e5b23))
* **Announcements:** Fixes issue with rendering announcements in workspaces ([1e38ec5](https://github.com/meetfranz/franz/commit/1e38ec5))
* **Windows:** Add Workspaces menu & fix Window menu ([92a61d4](https://github.com/meetfranz/franz/commit/92a61d4))
* **Windows:** Replace tray icon with high-res version ([a5eb399](https://github.com/meetfranz/franz/commit/a5eb399))
* **App:** Improved email validation ([dd8ddcc](https://github.com/meetfranz/franz/commit/dd8ddcc)) ([@Snuggle](https://github.com/Snuggle))


### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**
* **App:** Update electron to 5.0.2 ([5828062](https://github.com/meetfranz/franz/commit/5828062))



# [5.1.0](https://github.com/meetfranz/franz/compare/v5.1.0...v5.1.0-beta.1) (2019-04-16)

### Features

* **App:** Added Workspaces for all your daily routines 🎉 ([47c1c99](https://github.com/meetfranz/franz/commit/47c1c99))
* **App:** Added [Team Management](https://meetfranz.com/user/team) 🎉 ([47c1c99](https://github.com/meetfranz/franz/commit/47c1c99))
* **App:** Added Kerberos Support via Command Line Switches ([#1331](https://github.com/meetfranz/franz/issues/1331)) ([@frumania](https://github.com/frumania)) ([a1950d7](https://github.com/meetfranz/franz/commit/a1950d7))
* **App:** Open changelog in app
* **App:** Various small fixes and improvements 

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**
* **App:** Update electron to 4.1.4 ([2604914](https://github.com/meetfranz/franz/commit/2604914))


# [5.1.0-beta.1](https://github.com/meetfranz/franz/compare/v5.0.1-beta.1...v5.1.0-beta.1) (2019-04-16)

[See 5.1.0 changelog.](#5-1-0--2019-04-16-)

# [5.0.1](https://github.com/meetfranz/franz/compare/v5.0.0...v5.0.1) (2019-03-25)

### Features

* **App:** Add security checks for external URLs ([6e5531a](https://github.com/meetfranz/franz/commit/6e5531a))
* **Linux:** Add auto updater for Linux AppImage builds ([d641b4e](https://github.com/meetfranz/franz/commit/d641b4e))
* **Spell check:** Add British English as spell check language ([#1306](https://github.com/meetfranz/franz/issues/1306)) ([67fa325](https://github.com/meetfranz/franz/commit/67fa325))
* **Windows:** Add option to quit Ferdi from Taskbar icon ([952fc8b](https://github.com/meetfranz/franz/commit/952fc8b))

### Bug Fixes

* **Linux:** Fix minimized window focusing ([#1304](https://github.com/meetfranz/franz/issues/1304)) ([@skoruppa](https://github.com/skoruppa)) ([5b02c4d](https://github.com/meetfranz/franz/commit/5b02c4d))
* **Notifications:** Fix notifications & notification click when icon is blob ([03589f6](https://github.com/meetfranz/franz/commit/03589f6))
* **Service:** Fix service zoom (cmd/ctrl+ & cmd/ctrl-) ([91a0f59](https://github.com/meetfranz/franz/commit/91a0f59))
* **Service:** Fix shortcut for (un)muting notifications & audio ([1df3342](https://github.com/meetfranz/franz/commit/1df3342))
* **Windows:** Fix copy & paste in service context menus ([e66fcaa](https://github.com/meetfranz/franz/commit/e66fcaa)), closes [#1316](https://github.com/meetfranz/franz/issues/1316)
* **Windows:** Fix losing window when "Keep Ferdi in background" is enabled ([78a3722](https://github.com/meetfranz/franz/commit/78a3722))

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**
* **App:** Update electron to 4.0.8 ([8336d17](https://github.com/meetfranz/franz/commit/8336d17))


# [5.0.1-beta.1](https://github.com/meetfranz/franz/compare/v5.0.0...v5.0.1-beta.1) (2019-03-18)

[See 5.0.1 changelog.](#5-0-1--2019-03-25-)

# [5.0.0](https://github.com/meetfranz/franz/compare/5.0.0-beta.24...5.0.0) (2019-02-15)

### Features

* **Spellchecker:** Add automatic spellcheck language detection ([a5e7171](https://github.com/meetfranz/franz/commit/a5e7171))
* **Windows:** Add option to quit Ferdi from Taskbar ([8808601](https://github.com/meetfranz/franz/commit/8808601))

### Bug Fixes

* **App:** Various bugfixes and improvements

### General

* **App:** Updated electron to 4.0.4



# [5.0.0-beta.24](https://github.com/meetfranz/franz/compare/v5.0.0-beta.23...v5.0.0-beta.24) (2019-02-03)


### Bug Fixes

* **Service:** Fix unnecessary webview resize / Slack scroll issue ([4b7d3e2](https://github.com/meetfranz/franz/commit/4b7d3e2))
* **Service:** Improve focus when switching services ([d130f26](https://github.com/meetfranz/franz/commit/d130f26)), closes [#1255](https://github.com/meetfranz/franz/issues/1255)
* **Service:** Fix dark mode in services ([d529410](https://github.com/meetfranz/franz/commit/d529410))



# [5.0.0-beta.23](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.23) (2019-02-01)

### General

* **App:** Updated electron to 4.0.2 / Chromium 69

### Features

* **Service:** Add error screen for services that failed to load ([a5e7171](https://github.com/meetfranz/franz/commit/a5e7171))
* **Service:** Add option to change spellchecking language by service ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))

### Bug Fixes

* **App:** Fixed disable notification sounds 🔇
* **App:** Fix app delay for Premium Supporters ([08c40f0](https://github.com/meetfranz/franz/commit/08c40f0))
* **i18n:** Fix "greek" spellchecker name ([89c2eeb](https://github.com/meetfranz/franz/commit/89c2eeb))
* **Spellchecker:** Dictionaries are now part of app instead of dynamic download ([0cdc165](https://github.com/meetfranz/franz/commit/0cdc165))


<a name="5.0.0-beta.22"></a>
# [5.0.0-beta.22](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.22) (2018-12-13)


### Bug Fixes

* **Windows:** Package spellchecker dictionaries


<a name="5.0.0-beta.21"></a>
# [5.0.0-beta.21](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.21) (2018-12-11)

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

* **Service:** Add option to change spellchecking language by service ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))
* **Context Menu:** Quickly change the spellchecker language for the active service
* **Service:** Add error screen for services that failed to load ([a5e7171](https://github.com/meetfranz/franz/commit/a5e7171))
* **Service:** Add port option for proxy configuration ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))


### Bug Fixes

* **Spellchecker:** Fix issue with dictionary download ([0cdc165](https://github.com/meetfranz/franz/commit/0cdc165))

### Improvements

* **Dark Mode:** Dark Mode polishing
* **App:** Updated a ton of dependencies


<a name="5.0.0-beta.20"></a>
# [5.0.0-beta.20](https://github.com/meetfranz/franz/compare/v5.0.0-beta.19...v5.0.0-beta.20) (2018-12-05)


### Features

* **Windows:** Add taskbar action to reset Ferdi window ([08fa75a](https://github.com/meetfranz/franz/commit/08fa75a))
* **Context Menu:** Add "Go Back" and "Go Forward" ([5c18595](https://github.com/meetfranz/franz/commit/5c18595))
* **Context Menu:** Add Lookup, Search Google for ([5d5aa0c](https://github.com/meetfranz/franz/commit/5d5aa0c))
* **App:** Add `--devtools` command line arg to automatically open Dev Tools ([84fc3a0](https://github.com/meetfranz/franz/commit/84fc3a0))

### Bug Fixes

* **App:** Use system proxy for services ([8ddae4a](https://github.com/meetfranz/franz/commit/8ddae4a))
* **App:** Fix service request url ([7751c17](https://github.com/meetfranz/franz/commit/7751c17))
* **App:** Do not install App updates without user confirmation ([72fcaef](https://github.com/meetfranz/franz/commit/72fcaef))
* **Windows:** Fix quit app, really! ([ca1d618](https://github.com/meetfranz/franz/commit/ca1d618))
* **Context Menu:** Fix empty context menu item ([18040d4](https://github.com/meetfranz/franz/commit/18040d4))


<a name="5.0.0-beta.19"></a>
# [5.0.0-beta.19](https://github.com/meetfranz/franz/compare/v5.0.0-beta.18...v5.0.0-beta.19) (2018-12-02)

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

* **App:** 👉 Dark Mode 👈 ([fd7954f](https://github.com/meetfranz/franz/commit/fd7954f)) 🙌 [@guillecura](https://github.com/guillecura)
* **App:** Add proxy support for services ([6297274](https://github.com/meetfranz/franz/commit/6297274)) 
* **App:** New spell checker ([3d87c0e](https://github.com/meetfranz/franz/commit/3d87c0e))
* **App:** New context menu ([3d87c0e](https://github.com/meetfranz/franz/commit/3d87c0e))
* **App:** Lay groundwork for general themeing support ([4ea044a](https://github.com/meetfranz/franz/commit/4ea044a))
* **App:** Add option to enable dark mode for supported services ([fd7954f](https://github.com/meetfranz/franz/commit/fd7954f))

### Bug Fixes

* **App:** App menu was not initialized on app launch. Resolving copy & paste issues for login. ([72d4164](https://github.com/meetfranz/franz/commit/72d4164))
* **General:** Convert many links from http to https ([#967](https://github.com/meetfranz/franz/issues/967)) 🙌 [@Stanzilla](https://github.com/Stanzilla) ([04a23b7](https://github.com/meetfranz/franz/commit/04a23b7))
* **Menu:** Fix File -> Quit menu entry ([#888](https://github.com/meetfranz/franz/issues/888)) 🙌 [@dabalroman](https://github.com/dabalroman) ([4115b27](https://github.com/meetfranz/franz/commit/4115b27))
* **Windows:** Fix impossible Ctrl+10 Shortcut ([0db7c12](https://github.com/meetfranz/franz/commit/0db7c12))
* **Windows:** Remove minimize setting check on close event ([#1038](https://github.com/meetfranz/franz/issues/1038)) 🙌 [@imaginarny](https://github.com/imaginarny) ([af9d356](https://github.com/meetfranz/franz/commit/af9d356))


<a name="5.0.0-beta.18"></a>
# [5.0.0-beta.18](https://github.com/meetfranz/franz/compare/v5.0.0-beta.16...v5.0.0-beta.18) (2018-04-03)

### General
* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

* **App:** Add option to enable/disable hardware acceleration ([f720d30](https://github.com/meetfranz/franz/commit/f720d30))

### Bug Fixes

* **Windows:** Fix shortcuts for closing, minimizing, quitting and toggling fullscreen ([f720d30](https://github.com/meetfranz/franz/commit/f720d30))
* **Windows:** Hide title bar when in fullscreen ([655a6ed](https://github.com/meetfranz/franz/commit/655a6ed))


<a name="5.0.0-beta.17"></a>
# [5.0.0-beta.17](https://github.com/meetfranz/franz/compare/v5.0.0-beta.16...v5.0.0-beta.17) (2018-03-20)

### General

* **App:** Various performance improvements
* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**


### Features

* **Windows:** Replace window frame with custom menu bar ([9af5fd0](https://github.com/meetfranz/franz/commit/9af5fd0))
* **Electron:** Update electron to 1.8.4 ([b9c6616](https://github.com/meetfranz/franz/commit/b9c6616))
* **Mac:** Add dock bounce when new update is available ([47885bb](https://github.com/meetfranz/franz/commit/47885bb))
* **Services:** Improve performance when reordering services ([82e832c](https://github.com/meetfranz/franz/commit/82e832c))
* **Translations:** Add option to translate error messages and system menus ([82e832c](https://github.com/meetfranz/franz/commit/82e832c))

### Bug Fixes

* **App:** Fix app reload when coming back from sleep ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))
* **App:** Fix issue with app not showing services when recipe has invalid version (e.g. mailbox.org) ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))
* **Linux:** Fix missing/flickering ubuntu tray icon ([592f00a](https://github.com/meetfranz/franz/commit/592f00a))
* **Service Tabs:** Remove "delete service" context menu when not in development mode ([3a5c3f0](https://github.com/meetfranz/franz/commit/3a5c3f0))
* **Windows:** Improve app window handling ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))


<a name="5.0.0-beta.16"></a>
# [5.0.0-beta.16](https://github.com/meetfranz/franz/compare/v5.0.0-beta.15...v5.0.0-beta.16) (2018-02-23)

### General
* **App:** Update Electron version to 1.7.12 (fixes critical security vulnerability CVE-2018–1000006 ) ([c67d7d1](https://github.com/meetfranz/franz/commit/c67d7d1))
* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](https://i18n.meetfranz.com/)**

### Features
* **App:** Invite Friends in Settings ([ab33c44](https://github.com/meetfranz/franz/commit/ab33c44))

### Bug Fixes

* **App:** Fix memory leak in recipe polling loop ([c99848f](https://github.com/meetfranz/franz/commit/c99848f))
* **App:** Fix validation for side-by-side teamId & customURL ([bd51150](https://github.com/meetfranz/franz/commit/bd51150))
* **App:** Reload Ferdi instead of all services one by one on sleep resume ([4e5f7af](https://github.com/meetfranz/franz/commit/4e5f7af))
* **App:** Fix toggle buttons shown during import ([1220e2c](https://github.com/meetfranz/franz/commit/1220e2c))
fix(App): Bugfix Fix memory leak in recipe polling loop
* **App:** Fix invite screen [object Object] values ([81c4e99](https://github.com/meetfranz/franz/commit/81c4e99))
* **App:** Fix Franz-wide form validation ([7618f51](https://github.com/meetfranz/franz/commit/7618f51))
* **App:** Fix service tooltips not initialized properly ([8765b8f](https://github.com/meetfranz/franz/commit/8765b8f))
* **Linux:** Invert tray icon color & add border for bright UI's ([0de9c60](https://github.com/meetfranz/franz/commit/0de9c60))



<a name="5.0.0-beta.15"></a>
# [5.0.0-beta.15](https://github.com/meetfranz/franz/compare/v5.0.0-beta.14...v5.0.0-beta.15) (2018-01-10)

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

* **App:** Add option to clear app cache ([@dannyqiu](https://github.com/dannyqiu)) ([be801ff](https://github.com/meetfranz/franz/commit/be801ff))
* **App:** Add option to show/hide notification badges for muted ([893a9f6](https://github.com/meetfranz/franz/commit/893a9f6))
* **Recipes:** Add semver version validation ([5826dc3](https://github.com/meetfranz/franz/commit/5826dc3))
* **Recipes:** Add `hasHostedOption` to enable hosted & self hosted services ([03610f2](https://github.com/meetfranz/franz/commit/03610f2))
* **Services:** Add custom service icon upload ([6b97e42](https://github.com/meetfranz/franz/commit/6b97e42))
* **Services:** Add option to completely disable message badges ([cea7a5c](https://github.com/meetfranz/franz/commit/cea7a5c))
* **Services:** Improve handling of external links ([e2d6edf](https://github.com/meetfranz/franz/commit/e2d6edf))
* **Services:** Improve user experience of service search ([7e784c6](https://github.com/meetfranz/franz/commit/7e784c6))
* **Account:** Enable a user to delete their own account ([1f3df73](https://github.com/meetfranz/franz/commit/1f3df73))



### Bug Fixes

* **App:** Allow to turn on notifications when system dnd is enabled ([3045b47](https://github.com/meetfranz/franz/commit/3045b47))
* **App:** App mute now disables notifications as well ([0fa1caf](https://github.com/meetfranz/franz/commit/0fa1caf))
* **App:** Fix service reload after waking machine up ([531531e](https://github.com/meetfranz/franz/commit/531531e))
* **App:** Fix "add services manually" message ([ac417dc](https://github.com/meetfranz/franz/commit/ac417dc))
* **i18n:** Fallback to system language or english ([9733eaf](https://github.com/meetfranz/franz/commit/9733eaf))
* **Notification:** Remove notification sound when app is muted ([53fde0c](https://github.com/meetfranz/franz/commit/53fde0c))
* **Recipes:** Enable `urlInputPrefix` for team and customURL ([873957d](https://github.com/meetfranz/franz/commit/873957d))
* **Services:** Ctrl/Cmd+R now navigates back to the service root ([7293492](https://github.com/meetfranz/franz/commit/7293492))
* **Services:** Fix transparent service background ([ed0098f](https://github.com/meetfranz/franz/commit/ed0098f))
* **Shortcuts:** Fixed settings shortcut inconsistency ([ca74846](https://github.com/meetfranz/franz/commit/ca74846))
* **Spell checker:** Fixed issues with spell checker ([965fdf2](https://github.com/meetfranz/franz/commit/965fdf2))
* **Translations:** Re-add Spanish to available languages. ([ad936f2](https://github.com/meetfranz/franz/commit/ad936f2))
* **Windows:** Open window when clicking on toast notification ([b82bbc8](https://github.com/meetfranz/franz/commit/b82bbc8))


<a name="5.0.0-beta.14"></a>
# [5.0.0-beta.14](https://github.com/meetfranz/franz/compare/v5.0.0-beta.13...v5.0.0-beta.14) (2017-11-23)


### Features

* **App:** Add link to changelog in app update notification ([2cbd938](https://github.com/meetfranz/franz/commit/2cbd938))
* **App:** Add option to enable/disable spell checker ([dcab45a](https://github.com/meetfranz/franz/commit/dcab45a))
* **App:** Add option to mute all services in sidebar ([f5a9aa2](https://github.com/meetfranz/franz/commit/f5a9aa2))
* **App:** Decrease minimum window size to 600px width ([2521621](https://github.com/meetfranz/franz/commit/2521621))
* **App:** Respect System DoNotDisturb mode for service audio ([7d41227](https://github.com/meetfranz/franz/commit/7d41227))
* **Service:** Add option to display disabled services in tabs ([1839eff](https://github.com/meetfranz/franz/commit/1839eff))
* **Service:** Add option to mute service ([b405ba1](https://github.com/meetfranz/franz/commit/b405ba1))
* **Service:** Add dialog to reload crashed services ([259d40c](https://github.com/meetfranz/franz/commit/259d40c)) ([dannyqiu](https://github.com/dannyqiu))
* **Translations:** Added new translations and improved existing ones. **[A million thanks to the amazing community.](https://i18n.meetfranz.com/)**


### Bug Fixes

* **Windows:** Fix notifications on Windows 10 (Fall Creators Update) ([eea4801](https://github.com/meetfranz/franz/commit/eea4801))
* **macOS:** Fix TouchBar related crash on macOS 10.12.1 and lower ([9e9a2ed](https://github.com/meetfranz/franz/commit/9e9a2ed))
* **App:** Add fallback to service menu when service name is empty ([42ed24d](https://github.com/meetfranz/franz/commit/42ed24d))
* **App:** Prevent app from redirecting when dropping link ([811a527](https://github.com/meetfranz/franz/commit/811a527)) ([dannyqiu](https://github.com/dannyqiu))
* **Support with CPU:** Reduce maximum CPU usage ([64ad918](https://github.com/meetfranz/franz/commit/64ad918))
* **Hosted Services:** Do not strip www from custom service Url  ([a764321](https://github.com/meetfranz/franz/commit/a764321)) ([BeneStem](https://github.com/BeneStem))
* **Services:** Fix onNotify in service API ([b15421b](https://github.com/meetfranz/franz/commit/b15421b)) ([dannyqiu](https://github.com/dannyqiu))
* **Sidebar:** Fix tabs reordering ([86413ba](https://github.com/meetfranz/franz/commit/86413ba)) ([josescgar](https://github.com/josescgar))



<a name="5.0.0-beta.13"></a>
# [5.0.0-beta.13](https://github.com/meetfranz/franz/compare/v5.0.0-beta.12...v5.0.0-beta.13) (2017-11-06)

### Bug Fixes

* **Windows:** Fix issue with multiple close handlers that prevent the app from quitting  ([eea593e](https://github.com/meetfranz/franz/commit/eea593e))


<a name="5.0.0-beta.12"></a>
# [5.0.0-beta.12](https://github.com/meetfranz/franz/compare/v5.0.0-beta.11...v5.0.0-beta.12) (2017-11-05)

### Features

* **Menu:** Add "About Ferdi" Menu item to Windows/Linux ([a21b770](https://github.com/meetfranz/franz/commit/a21b770))
* **Menu:** Add menu item to toggle (service) dev tools ([e8da383](https://github.com/meetfranz/franz/commit/e8da383))
* **Translation:** Add italian translation ([ab348cc](https://github.com/meetfranz/franz/commit/ab348cc)) ([dnlup](https://github.com/dnlup))


### Bug Fixes

* **App:** Add checks to service url validation to prevent app freeze  ([db8515f](https://github.com/meetfranz/franz/commit/db8515f))
* **macOS:** Fix disable launch Ferdi on start ([34bba09](https://github.com/meetfranz/franz/commit/34bba09))
* **Windows:** Launch Ferdi on start when selected ([34bba09](https://github.com/meetfranz/franz/commit/34bba09))
* **Onboarding:** Fix issue with import of on-premise services ([7c7d27d](https://github.com/meetfranz/franz/commit/7c7d27d))
* **Shortcuts:** Flip shortcut to navigate to next/previous service ([37d5923](https://github.com/meetfranz/franz/commit/37d5923))
* **Windows:** Open Window when app is pinned to taskbar and minimized to system tray ([777814a](https://github.com/meetfranz/franz/commit/777814a))
* **Recipes:** Recipe developers don't need Premium Supporter Account for debugging ([7a9947a](https://github.com/meetfranz/franz/commit/7a9947a))



<a name="5.0.0-beta.11"></a>
# [5.0.0-beta.11](https://github.com/meetfranz/franz/compare/v5.0.0-beta.10...v5.0.0-beta.11) (2017-10-24)

### Features

* **Settings:** Add option to disable system tray icon ([c62f3fc](https://github.com/meetfranz/franz/commit/c62f3fc))
* **Service:** Display URL of hyperlinks ([a0cec4d](https://github.com/meetfranz/franz/commit/a0cec4d)) ([GustavoKatel](https://github.com/GustavoKatel))
* **App:** Add tab cycling with ctrl[+shift]+tab or ctrl+[pageup|pagedown] ([e58f558](https://github.com/meetfranz/franz/commit/
e58f558)) ([GustavoKatel](https://github.com/GustavoKatel))
* **Translation:** Add Brazilian Portuguese ([phmigotto](https://github.com/phmigotto))
* **Translation:** Add Dutch ([cpeetersburg](https://github.com/cpeetersburg), [Blizzke](https://github.com/Blizzke))
* **Translation:** Add Flemish ([Blizzke](https://github.com/Blizzke), [mroeling](https://github.com/mroeling))
* **Translation:** Add German ([rherwig](https://github.com/rherwig), [berndstelzl](https://github.com/berndstelzl))
* **Translation:** Add Greek ([apo-mak](https://github.com/apo-mak))
* **Translation:** Add French ([Shadorc](https://github.com/Shadorc), [ShiiFu](https://github.com/ShiiFu))
* **Translation:** Add Japanese ([koma-private](https://github.com/koma-private))
* **Translation:** Add Polish ([grzeswol](https://github.com/grzeswol))
* **Translation:** Add Russian ([vaseker](https://github.com/vaseker))
* **Translation:** Add Ukrainian ([Kietzmann](https://github.com/Kietzmann))

### Bug Fixes

* **App:** Force Ferdi to use single window ([2ae409e](https://github.com/meetfranz/franz/commit/2ae409e))
* **Onboarding:** Fix enable/disable service import toggle ([23174f9](https://github.com/meetfranz/franz/commit/23174f9))
* **Onboarding:** Fix service import ([99d1c01](https://github.com/meetfranz/franz/commit/99d1c01))
* **Payment:** Fix payment window when name contains special character ([a854614](https://github.com/meetfranz/franz/commit/a854614))
* **macOS:** Add macOS dark theme system tray icon ([55805f1](https://github.com/meetfranz/franz/commit/55805f1))
* **Windows:** Fix enable/disable autostart on login ([eca7f3b](https://github.com/meetfranz/franz/commit/eca7f3b))
* **Windows:** Fix multiple system tray icons when opening/closing Ferdi ([5b9b0c7](https://github.com/meetfranz/franz/commit/5b9b0c7))
