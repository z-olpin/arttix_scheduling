const webpack = require("webpack");
const path = require("path");


module.exports = {
  entry: './src/public/index.js',
  mode: "development",
  target: "web",
  devtool: "cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "main.js"
  },
  devServer: {
    stats: "minimal",
    overlay: true,
    historyApiFallback: true,
    disableHostCheck: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    https: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /prog/],
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};