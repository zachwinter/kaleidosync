const webpack = require('webpack')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/sass/imports.scss";`
      }
    }
  },
  configureWebpack: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:8001',
          pathRewrite: { '^/api' : '' }
        }
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        STATE_KEY: JSON.stringify(process.env.STATE_KEY),
        ACCESS_TOKEN: JSON.stringify(process.env.ACCESS_TOKEN),
        REFRESH_TOKEN: JSON.stringify(process.env.REFRESH_TOKEN),
        REFRESH_CODE: JSON.stringify(process.env.REFRESH_CODE),
        GOOGLE_ANALYTICS: JSON.stringify(process.env.GOOGLE_ANALYTICS),
        PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
        DEVELOPMENT: JSON.stringify(process.env.NODE_ENV !== 'production'),
        PROJECT_ROOT: JSON.stringify(process.env.PROJECT_ROOT)
      })
    ]
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  },
  transpileDependencies: ['vuex-persist']
}