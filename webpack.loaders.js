module.exports = [
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components|public\/)/,
    loader: "babel-loader",
    query: {
      presets: ['react', 'es2015', 'stage-0'],
      plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
    }
  },
  {
    test: /\.js?$/,
    exclude: /(node_modules|bower_components|public\/)/,
    loader: "babel-loader",
    query: {
      presets: ['react', 'es2015', 'stage-0'],
      plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
    }
  },
  {
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader?importLoaders=1'],
    exclude: ['node_modules']
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    exclude: /(node_modules|bower_components)/,
    loader: "file-loader"
  },
  {
    test: /\.(woff|woff2)$/,
    exclude: /(node_modules|bower_components)/,
    loader: "file-loader?prefix=font/&limit=5000"
  },
  {
    test: /\.(otf)$/,
    exclude: /(node_modules|bower_components)/,
    loader: "file-loader?prefix=font/&limit=5000"
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    exclude: /(node_modules|bower_components)/,
    loader: "file-loader?limit=10000&mimetype=application/octet-stream"
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    exclude: /(node_modules|bower_components)/,
    loader: "file-loader?limit=10000&mimetype=image/svg+xml"
  },
  {
    test: /\.gif/,
    exclude: /(node_modules|bower_components)/,
    loader: "file-loader?limit=10000&mimetype=image/gif"
  },
  {
    test: /\.jpg/,
    exclude: /(node_modules|bower_components)/,
    loader: "file-loader?limit=10000&mimetype=image/jpg"
  },
  {
    test: /\.png/,
    exclude: /(node_modules|bower_components)/,
    loader: "file-loader?limit=10000&mimetype=image/png"
  }
];
