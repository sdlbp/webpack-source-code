const path = require('path')
const {hooklog}  = require('../plugins/hooklog/index')
const {hookoptions}  = require('../plugins/hookoptions/index')
module.exports = {
  entry: './src/index.js',
  context: path.resolve(__dirname, "."),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: "development",
  devtool: "source-map",
  module: {
    // rules: [
    //   {
    //     test: /\.js$/,
    //     use: ['babel-loader']
    //   }
    // ]
  },
  plugins: [
    // hooklog,
    // hookoptions
  ]
}
