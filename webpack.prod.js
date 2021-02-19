const fs = require('fs');

const path = require('path');

const webpack = require('webpack');

const merge = require('webpack-merge');

const commonConfig = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: __dirname + '/src/scripts/app.js',
  module: {
    rules: [{
      test: /.s[ac]ss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, 'css-loader', 'sass-loader']
    }, {
      test: /.html$/i,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: false
        }
      }]
    }]
  },
  plugins: [...generateHtmlPlugins(path.resolve(__dirname, 'src/markup')), new MiniCssExtractPlugin({
    filename: 'styles.[hash].css'
  }), new CleanWebpackPlugin({
    verbose: true
  })]
});

function generateHtmlPlugins(templateDir) {
  const files = fs.readdirSync(templateDir);
  return files.map(file => {
    const [name, ext] = file.split('.');
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${ext}`),
      minify: false
    });
  });
}