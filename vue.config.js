const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: 'Shop List - Vue',
    themeColor: '#008030',
    msTileColor: '#f5f5f5',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#008030',
    workboxPluginMode: 'GenerateSW',
  }
})
