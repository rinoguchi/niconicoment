const ejs = require('ejs');
const CopyPlugin = require('copy-webpack-plugin');

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}

module.exports = {
  mode: 'development',
  context: __dirname + '/src',
  entry: {
    'background': './background.js',
    'presenter': './presenter.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // { from: 'icons', to: 'icons' },
        { from: 'background.html', to: 'background.html', transform: transformHtml },
        { from: 'manifest.json', to: 'manifest.json', transform: transformHtml },
      ],
    }),
  ],
  externals: {},
};



