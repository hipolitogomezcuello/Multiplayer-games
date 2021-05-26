const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/js/App.js",
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new NodemonPlugin(),
  ]
}