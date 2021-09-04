const webpack = require('webpack')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@use "@/sass/global.scss" as *;`
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        PROJECT_ROOT: JSON.stringify(process.env.PROJECT_ROOT),
        ACCESS_TOKEN: JSON.stringify(process.env.ACCESS_TOKEN),
        REFRESH_TOKEN: JSON.stringify(process.env.REFRESH_TOKEN),
        REFRESH_CODE: JSON.stringify(process.env.REFRESH_CODE),
        GOOGLE_ANALYTICS: JSON.stringify(process.env.GOOGLE_ANALYTICS),
        PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
        DEVELOPMENT: JSON.stringify(process.env.NODE_ENV !== 'production'),
        DATA_URL: JSON.stringify(process.env.DATA_URL),
      })
    ]
  }
}