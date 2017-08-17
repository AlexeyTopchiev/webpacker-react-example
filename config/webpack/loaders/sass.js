const configureExtractTextPlugin = require('../extracttext.js')
const { resolve } = require('path');

module.exports = {
  test: /\.(scss|sass|css)$/i,
  include: [
    resolve('app/assets/stylesheets'),
    resolve('node_modules'),
  ],
  use: configureExtractTextPlugin(false),
}
