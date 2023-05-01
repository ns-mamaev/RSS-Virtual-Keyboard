const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: { app: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash:8].js',
  },
  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 1234,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Virtual Keyboard',
    }),
    new MiniCssExtractPlugin({
      filename: '[name][contenthash:8].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};
