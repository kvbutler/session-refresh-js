const path = require('path');


module.exports = {
  entry: './dist/session-refresh.min.js',
  output: {
    library: 'createSessionRefresh',
    libraryTarget: 'umd',
    filename: 'session-refresh-webpack.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
            path.resolve(__dirname, 'node_modules')
        ],
        include: [
            path.resolve(__dirname, 'dist')
        ],
        loader: 'babel-loader'
      }
    ]
  }
};
