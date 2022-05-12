
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


