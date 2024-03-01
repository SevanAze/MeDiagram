const path = require("path");
const dotenv = require("dotenv").config();
const webpack = require("webpack");

module.exports = {
  entry: "./client/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
     }
    ],
  },
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    magicHtml: true,
    historyApiFallback: true,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/dist/",
  },
  plugins: [],
};
