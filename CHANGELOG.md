# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2019-07-05

### Fixed

- Changed url to access bot from https://www.amazon.com/ga/giveaways/bot to https://www.amazon.com/giveaway/ to address [#11](https://github.com/TyGooch/amazon-giveaway-bot/issues/11)

## [2.1.2] - 2019-07-02

### Fixed

- Redirect after timeout if 404 occurs [#9](https://github.com/TyGooch/amazon-giveaway-bot/issues/9)

- Fix claiming Kindle prizes and allow option to disable entry if wanted [#10](https://github.com/TyGooch/amazon-giveaway-bot/issues/10)

- Fix typos in changelog

## [2.1.1] - 2019-07-02

### Fixed

- Automatically unfollow authors [#7](https://github.com/TyGooch/amazon-giveaway-bot/issues/7)

### Added

- Logs are now visible on the UI, allowing users to monitor progress and access data from past sessions

## [2.1.0] - 2019-07-01

### Fixed

- Fixed logic behind claiming a prize [#6](https://github.com/TyGooch/amazon-giveaway-bot/issues/6)

### Added

- Improved support for using bot with multiple accounts on same machine

### Changed

- Starting the bot now requires entering email and password in the control panel

## [2.0.1] - 2019-05-30

### Fixed

- Allow user to stop bot and interact with page elements before resuming execution [#5](https://github.com/TyGooch/amazon-giveaway-bot/issues/5)

### Added

- Experimental turbo mode
- Add button to clear history of entered giveaways
- Update readme with new url to use bot and info on turbo mode
- Add changelog

### Changed

- Bot is now accessed by going to https://www.amazon.com/ga/giveaways/bot instead of https://www.amazon.com/ga/giveaways
- UI now displays only giveaway content rather than the whole page

[2.0.1]: https://github.com/tygooch/amazon-giveaway-bot/releases/tag/v2.0.1
