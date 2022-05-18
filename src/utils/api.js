const Base_Upload_url = process.env.VUE_APP_BASE_API,
      CLOUD = CLOUD,
      GLOBAL = uni
      
export const download_file_common = async (url, name = '', header = {}) => {
  const types = 'doc, xls, ppt, pdf, docx, xlsx, pptx' // 支持类型

  const downloadMsg = await GLOBAL.downloadFile({ url, header })
  let tempFilePaths = downloadMsg.filter(item => item), obj = tempFilePaths[0]
  if (obj.statusCode === 200 && obj.tempFilePath) {
    const openMsg = await GLOBAL.openDocument({ filePath: obj.tempFilePath, showMenu: true })
    if (!!WeixinJSBridge) {
      GLOBAL.showModal({ content: '请使用手机浏览器打开', showCancel: false })
    }
  } else {
    GLOBAL.showToast({ title: '下载失败', icon: 'error' })
  }
}

/**
 * 
 * @param {*} url { url“ 后端接口 }
 * @param {*} data { course_id: id 课程id, url: location.href  当前页面 }
 */
export const share_WeixinJSBridge = (url, data) => {
  wx.request({
    url,
    data, 
    dataType: 'json',
    success(res) {
      console.log('res', res);
      const wxConfig = res.data.js_config || {}
      const shareConfig = Array.isArray(res.data.share_config) ? {} : res.data.share_config
      wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: wxConfig.appId, // 必填，公众号的唯一标识
          timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
          signature: wxConfig.signature,// 必填，签名
          jsApiList: wxConfig.jsApiList // 必填，需要使用的JS接口列表
      })
      wx.ready(function () {
        console.log('ready');
          // 微信好友
          wx.updateAppMessageShareData({
              title: shareConfig.title, // 分享标题
              desc: shareConfig.desc, // 分享描述
              link: shareConfig.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: shareConfig.imgUrl, // 分享图标
              fail: function (error) {
                  console.log('设置失败', error)
              }
          })
          // 朋友圈
          wx.updateTimelineShareData({
              title: shareConfig.title, // 分享标题
              link: shareConfig.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: shareConfig.imgUrl, // 分享图标
              fail: function (error) {
                  console.log('设置失败', error)
              }
          })
          wx.showMenuItems({
              menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"] // 要显示的菜单项，所有menu项见附录3
          })
      })
      wx.error(function (err) {
        console.log(errr)
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      })
    }
  })
}