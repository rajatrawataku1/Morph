var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./app/client.js",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      {
          test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|otf|svg)(\?[a-z0-9=.]+)?$/,
          loader: 'url-loader'
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
    ]
  },
  output: {
    path: __dirname + "/dist/",
    filename: "client.min.js"
  },
  plugins : [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"dev"'
      }
    })
  ],
};
