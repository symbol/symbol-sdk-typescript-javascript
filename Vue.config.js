const path = require('path')

module.exports = {
  // base url
  publicPath: process.env.NODE_ENV === 'production'
      ? './'
      : '/',
  // output dir
  outputDir: './www',
  assetsDir: 'static',
  // eslint-loader check
  lintOnSave: true,
  // webpack
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    //edit path alias
    config.resolve.alias
        .set('config', path.resolve(__dirname, './src/config'),)
  },
  // generate map
  productionSourceMap: true,
  //use template in vue
  runtimeCompiler: true,
  // css
  css: {
    // ExtractTextPlugin
    extract: false,
    //  CSS source maps?
    sourceMap: false,
    // css loader
    loaderOptions: {
      postcss: {
        config: {
          path: '.postcss.config.js'
        }
      }
    },
    // CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // webpack-dev-server
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    before: app => {
    }
  },
  // plugins
  pluginOptions: {
    "process.env": {
      NODE_DEV: '"development"'
    }
  }
}
