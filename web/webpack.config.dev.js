const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = "development";

module.exports = {
  mode: "development",
  target: "web",
  devtool: "cheap-module-source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js",
  },
  stats: "minimal",
  devServer: {
    client: {
      // overlay: true,
      overlay: false,
    },
    proxy: {
      "/appserver1": {
        target: "http://localhost:8080",
        pathRewrite: { "^/appserver1/": "" },
      },
      "/appserver2": {
        target: "http://localhost:8081",
        pathRewrite: { "^/appserver2/": "" },
      },
    },
    historyApiFallback: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./src/favicon.png",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"],
      },
      {
        test: /(\.css)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
};
