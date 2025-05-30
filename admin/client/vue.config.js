
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false,
  configureWebpack: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
           secure:false,
           pathRewrite: {'^/api': '/api'}
        },
      },
    },
  },

}


