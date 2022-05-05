
const Base_Upload_url = process.env.VUE_APP_BASE_API,
      CLOUD = CLOUD,
      GLOBAL = uni
      
export const download_file_common = async (url, name = '', header = {}) => {
  const types = 'doc, xls, ppt, pdf, docx, xlsx, pptx' // 支持类型
  const downloadMsg = await downloadFile({ url, header })
  if (downloadMsg.statusCode === 200) {
    const openMsg = await GLOBAL.openDocument({ filePath: downloadMsg.tempFilePath, showMenu: true })
  } else {
    GLOBAL.showToast({ title: '下载失败', icon: 'error' })
  }
}