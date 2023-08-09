/* eslint-disable */
const nodeExternals = require('webpack-node-externals')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const tsConfigFile = 'tsconfig.build.json'

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  ignoreWarnings: [/^(?!CriticalDependenciesWarning$)/],
  optimization: {
    nodeEnv: false,
  },
  stats: {
    assets: false,
    modules: false,
    builtAt: false,
    hash: false,
  },
  devtool: 'inline-source-map',

  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  externalsPresets: { node: true },
  mode: 'none',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: false,
          configFile: tsConfigFile,
        },
      },
    ],
  },
  node: {
    __filename: false,
    __dirname: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: tsConfigFile,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          'cache-manager',
          'class-validator',
          'class-transformer',
        ]
        if (!lazyImports.includes(resource)) {
          return false
        }
        try {
          require.resolve(resource, {
            paths: [process.cwd()],
          })
        } catch (err) {
          return true
        }
        return false
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/],
    }),
    new RunScriptWebpackPlugin({
      name: 'main.js',
      autoRestart: false,
    }),
  ],
}
