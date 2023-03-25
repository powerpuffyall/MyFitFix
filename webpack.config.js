const path = require('path');

const dist = path.join(__dirname, '/client/dist');

module.exports = {
  entry: './client/src/index.jsx',
  output: {
    filename: 'build.js',
    path: dist,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }

        }
      }
    ]
  }
};