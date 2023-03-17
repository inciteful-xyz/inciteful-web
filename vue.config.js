module.exports = {
  chainWebpack: config => {
    config.module
      .rule('yaml')
      .test(/\.yaml$/)
      .use('js-yaml-loader')
      .loader('js-yaml-loader')
      .end()
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
