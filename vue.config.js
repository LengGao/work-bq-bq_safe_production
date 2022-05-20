const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
module.exports = {
    transpileDependencies: ['@dcloudio/uni-ui'],
    chainWebpack: (config) => {
        config
        .plugin('MomentLocalesPlugin')
        .use(MomentLocalesPlugin, [{ localesToKeep: ['zh-cn'] }])
    }
}