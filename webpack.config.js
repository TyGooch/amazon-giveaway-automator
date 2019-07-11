const path = require('path')
const WebpackUserscript = require('webpack-userscript')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'amazonGiveawayBot.user.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        name: 'amazon-giveaway-bot',
        version: dev ? `[version]-build.[buildNo]` : `[version]`,
        description: 'Automates Amazon giveaway entries',
        updateURL: 'https://github.com/TyGooch/amazon-giveaway-bot/raw/master/dist/amazonGiveawayBot.user.js',
        match: 'https://www.amazon.com/giveaway/*',
        grant: ['GM_setValue', 'GM_getValue', 'GM_addStyle', 'GM_notification', 'unsafeWindow', 'window.focus'],
        'run-at': 'document-start',
        noframes: true,
      },
      pretty: false,
    }),
  ],
}
