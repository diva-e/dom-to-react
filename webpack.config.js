const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const devtool = isProd ? 'hidden-source-map' : 'source-map';

const mode = isProd ? 'production' : 'development';

const performance = isProd ? {} : {
  hints: false
};

const entry = isProd ? './src/dom-to-react/index.js' : './src/main.js';

const output = {
  path: path.join(__dirname, 'dist'),
  filename: 'dom-to-react.js',
};

if (isProd) {
  output.libraryTarget = 'umd';
  output.library = 'dom-to-react';
}

const externals = isProd ? {
  react: {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react',
  },
} : {};


const rules = [];

const babelLoader = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: 'babel-loader',
};
rules.push(babelLoader);

if (!isProd) {
  const jsonLoader = {
    test: /\.json$/,
    use: 'json-loader',
  };
  rules.push(jsonLoader);
}

const resolve = {
  extensions: ['.js', '.jsx'],
  modules: [
    path.resolve(__dirname, 'src'),
    'node_modules',
  ],
};

const plugins = [];

if (!isProd) {

  const htmlWebpackPlugin = new HTMLWebpackPlugin({
    title: 'dom-to-react Demo',
    template: 'src/assets/index.ejs',
  });
  plugins.push(htmlWebpackPlugin);
}

const definePlugin = new webpack.DefinePlugin({
  NO_WRITE_FS: true,
  'process.env': {
    'NODE_ENV': JSON.stringify(nodeEnv),
  },
});
plugins.push(definePlugin);

if (!isProd) {
  const namedModulesPlugin = new webpack.NamedModulesPlugin();
  plugins.push(namedModulesPlugin);

  const NoEmitOnErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();
  plugins.push(NoEmitOnErrorsPlugin);
}

const devServer = {
  inline: true,
  host: '0.0.0.0',
};

module.exports = {
  devtool,
  mode,
  performance,
  entry,
  output,
  externals,
  module: {
    rules,
  },
  resolve,
  plugins,
  devServer,
};
