const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: 'svelte-loader',
      },
      { test: /.m?js$/, type: 'javascript/auto', resolve: { fullySpecified: false } },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Pill Notifier',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
      favicon: './static/favicon.ico',
    }),
  ],
  resolve: {
    alias: {
      // Makes sure only one version of Svelte runtime is bundled
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  devtool: 'inline-source-map',
};
