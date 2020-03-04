const path = require('path')

module.exports = {
  // base url
  publicPath: process.env.NODE_ENV === 'production'
      ? './'
      : '/',
  // output dir
  outputDir: './dist',
  assetsDir: 'static',
  // eslint-loader check
  lintOnSave: true,
  // webpack
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {},
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
    },
    proxy: {
      '/nemflash': {
        target: 'https://nemflash.io/feed/',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/nemflash': '' }
      },
    }
  },
  // plugins
  pluginOptions: {
    "process.env": {
      NODE_DEV: '"development"'
    }
  }
}
