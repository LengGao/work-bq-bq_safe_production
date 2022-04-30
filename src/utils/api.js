// 上传图片

// 'use strict';

// const Base_Upload_url = process.env.VUE_APP_BASE_API,
//   ERR_MSG_OK = 'chooseAndUploadFile:ok',
//   ERR_MSG_FAIL = 'chooseAndUploadFile:fail',
//   CLOUD = CLOUD,
//   GLOBAL = uni
const GLOBAL = uni

/**
 * 
 * @param {*} options 
 * @returns 
 */
export function compressImage(options) {
  return new Promise(function (resolve, reject) {
    GLOBAL.compressImage({
      ...options,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    })
  })
}

export function upLoadFile(options) {
  return new Promise(function (resolve, reject) {
    options.url = Base_Upload_url + options.url
    GLOBAL.uploadFile({
      ...options,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    })
  })
}

export function chooseMessageFile(options) {
  return new Promise(function (resolve, reject) {
    GLOBAL.chooseMessageFile({
      ...options,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    })
  })
}

export function downloadFile(options) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      ...options,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    })
  })
}


export const download_canva_h5 = (url, name = '', type= 'image/png', encoderOptions = 0.95, crossOrigin = 'anonymous') => {
  const nameReg = /[A-z]+\:\/\/|\//i
  let a, canvas, image, event, filename = name

  if (!filename) filename = url.split(nameReg).pop()
  if (type.split('/').pop() !== filename.split('.').pop()) throw new Error('扩展名必须与类型一致');
  
  a = document.createElement('a')
  canvas = document.createElement('canvas')
  image = new Image()
  event = new MouseEvent('click')

  image.setAttribute('crossOrigin', crossOrigin)
  image.onload = function (ee) {
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    a.href = canvas.toDataURL(type, encoderOptions)
    a.download = filename // 必须同源
    a.dispatchEvent(event)
  }

  image.src = url
}

export const downLoad_link_H5 = (url, name = '') => {
  const nameReg = /[A-z]+\:\/\/|\//i,
        urlReg = /^data:|blob:/i

  let a = document.createElement('a'), 
      e = new MouseEvent('click'),
      filename = name

  if (!filename) filename = url.split(nameReg).pop()
  if (!url.match(urlReg)) a.download = filename
  
  a.href = url
  a.dispatchEvent(e)
}


export const downLoad_blob_H5 = (url, header) => {
  const nameReg = /filename=([^;]+\\.[^\\.;]+);*/
  
  GLOBAL.request({ url: url, header: header})
    .then(res => {
      let disposition = res.headers['content-disposition']
      let filename = disposition.match(nameReg)[1]
      let blob = new Blob(res.data.datq)
      let link = URL.createObjectURL(blob)
      downLoad_link_H5(link, filename)
    })
    .catch(err => {
      GLOBAL.showToast({ title: `下载请求发送失败`, icon: 'error'})
    })
}

export const download_file_miniapp = async(url, header) =>{
  const fileManager = GLOBAL.getFileSystemManager()

  const downloadMsg = await downloadFile({ url: url, header: {}})
  console.log("downloadMsg", downloadMsg);
  // const saveMsg = fileManager.saveFile({ tempFilePath: downloadMsg.tempFilePath })
  const open = await GLOBAL.openDocument({ filePath: downloadMsg.filePath })
  console.log("open", open);

}