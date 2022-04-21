// 上传图片

'use strict';

const Base_Upload_url = process.env.VUE_APP_BASE_API,
  ERR_MSG_OK = 'chooseAndUploadFile:ok',
  ERR_MSG_FAIL = 'chooseAndUploadFile:fail',
  CLOUD = CLOUD,
  GLOBAL = uni



/**             utils                 */
/**
 * 获取文件名和后缀
 * @param {String} name
 */
export const get_file_ext = (name) => {
  const last_len = name.lastIndexOf('.')
  const len = name.length
  return { name: name.substring(0, last_len), ext: name.substring(last_len + 1, len) }
}

/**
 * 获取扩展名
 * @param {Array} fileExtname
 */
export const get_extname = (fileExtname) => {
  if (!Array.isArray(fileExtname)) {
    let extname = fileExtname.replace(/(\[|\])/g, '')
    return extname.split(',')
  } else {
    return fileExtname
  }
}

/**
 * 获取文件和检测是否可选
 */
export const get_files_and_is_max = (res, _extname) => {
  let filePaths = []
  let files = []
  if (!_extname || _extname.length === 0) {
    return { filePaths, files }
  }
  res.tempFiles.forEach(v => {
    let fileFullName = get_file_ext(v.name)
    const extname = fileFullName.ext.toLowerCase()
    if (_extname.indexOf(extname) !== -1) {
      files.push(v)
      filePaths.push(v.path)
    }
  })
  if (files.length !== res.tempFiles.length) {
    GLOBAL.showToast({
      title: `当前选择了${res.tempFiles.length}个文件 ，${res.tempFiles.length - files.length} 个文件格式不正确`,
      icon: 'none',
      duration: 5000
    })
  }

  return { filePaths, files }
}

/**
 * 获取图片信息
 * @param {Object} filepath
 */
export const get_file_info = (filepath) => {
  return new Promise((resolve, reject) => {
    GLOBAL.getImageInfo({ src: filepath, success: resolve, fail: reject })
  })
}

/**
 * 获取封装数据
 */
export const get_file_data = async (files, type = 'image') => {
  // 最终需要上传数据库的数据
  let fileFullName = get_file_ext(files.name)
  const extname = fileFullName.ext.toLowerCase()
  let filedata = {
    name: files.name,
    uuid: files.uuid,
    extname: extname || '',
    cloudPath: files.cloudPath,
    fileType: files.fileType,
    url: files.path || files.path,
    size: files.size, //单位是字节
    image: {},
    path: files.path,
    video: {}
  }
  if (type === 'image') {
    const imageinfo = await get_file_info(files.path)
    delete filedata.video
    filedata.image.width = imageinfo.width
    filedata.image.height = imageinfo.height
    filedata.image.location = imageinfo.path
  } else {
    delete filedata.image
  }
  return filedata
}


export function chooseImage(opts) {
  const {
    count,
    sizeType = ['original', 'compressed'],
    sourceType = ['album', 'camera'],
    extension
  } = opts
  return new Promise((resolve, reject) => {
    GLOBAL.chooseImage({
      count,
      sizeType,
      sourceType,
      extension,
      success(res) {
        resolve(normalizeChooseAndUploadFileRes(res, 'image'));
      },
      fail(res) {
        reject({
          errMsg: res.errMsg.replace('chooseImage:fail', ERR_MSG_FAIL),
        });
      },
    });
  });
}

export function chooseVideo(opts) {
  const { camera, compressed, maxDuration, sourceType = ['album', 'camera'], extension } = opts;
  return new Promise((resolve, reject) => {
    GLOBAL.chooseVideo({
      camera, compressed, maxDuration, sourceType, extension,
      success(res) {
        const { tempFilePath, duration, size, height, width } = res;
        resolve(normalizeChooseAndUploadFileRes({
          errMsg: 'chooseVideo:ok',
          tempFilePaths: [tempFilePath],
          tempFiles: [
            {
              name: (res.tempFile && res.tempFile.name) || '',
              path: tempFilePath,
              size,
              type: (res.tempFile && res.tempFile.type) || '',
              width,
              height,
              duration,
              fileType: 'video',
              cloudPath: '',
            },],
        }, 'video'));
      },
      fail(res) {
        reject({
          errMsg: res.errMsg.replace('chooseVideo:fail', ERR_MSG_FAIL),
        });
      },
    });
  });
}

export function chooseAll(opts) {
  const { count, extension } = opts;
  return new Promise((resolve, reject) => {
    let chooseFile = GLOBAL.chooseFile;
    if (typeof wx !== 'undefined' &&
      typeof wx.chooseMessageFile === 'function') {
      chooseFile = wx.chooseMessageFile;
    }
    if (typeof chooseFile !== 'function') {
      return reject({
        errMsg: ERR_MSG_FAIL + ' 请指定 type 类型，该平台仅支持选择 image 或 video。',
      });
    }
    chooseFile({
      type: 'all',
      count,
      extension,
      success(res) {
        resolve(normalizeChooseAndUploadFileRes(res));
      },
      fail(res) {
        reject({
          errMsg: res.errMsg.replace('chooseFile:fail', ERR_MSG_FAIL),
        });
      },
    });
  });
}

export function normalizeChooseAndUploadFileRes(res, fileType) {
  res.tempFiles.forEach((item, index) => {
    if (!item.name) {
      item.name = item.path.substring(item.path.lastIndexOf('/') + 1);
    }
    if (fileType) {
      item.fileType = fileType;
    }
    item.cloudPath =
      Date.now() + '_' + index + item.name.substring(item.name.lastIndexOf('.'));
  });
  if (!res.tempFilePaths) {
    res.tempFilePaths = res.tempFiles.map((file) => file.path);
  }
  return res;
}

/**
 * uni 云上传
 * @param {*} files 
 * @param {*} max 
 * @param {*} onUploadProgress 
 * @returns 
 */
export function uploadCloudFiles(files, max = 5, onUploadProgress) {
  files = JSON.parse(JSON.stringify(files))
  const len = files.length
  let count = 0
  let self = this
  return new Promise(resolve => {
    while (count < max) {
      next()
    }

    function next() {
      let cur = count++
      if (cur >= len) {
        !files.find(item => !item.url && !item.errMsg) && resolve(files)
        return;
      }
      const fileItem = files[cur]
      const index = self.files.findIndex(v => v.uuid === fileItem.uuid)
      fileItem.url = ''
      delete fileItem.errMsg

      CLOUD.uploadFile({
        filePath: fileItem.path,
        cloudPath: fileItem.cloudPath,
        fileType: fileItem.fileType,
        onUploadProgress: res => {
          res.index = index
          onUploadProgress && onUploadProgress(res)
        }
      })
        .then(res => {
          fileItem.url = res.fileID
          fileItem.index = index
          if (cur < len) {
            next()
          }
        })
        .catch(res => {
          fileItem.errMsg = res.errMsg || res.message
          fileItem.index = index
          if (cur < len) {
            next()
          }
        })
    }
  })
}

export function uploadFiles(choosePromise, { onChooseFile, onUploadProgress }) {
  return choosePromise
    .then((res) => {
      if (onChooseFile) {
        const customChooseRes = onChooseFile(res);
        if (typeof customChooseRes !== 'undefined') {
          return Promise.resolve(customChooseRes).then((chooseRes) => typeof chooseRes === 'undefined' ?
            res : chooseRes);
        }
      }
      return res;
    })
    .then((res) => {
      return res === false ? { errMsg: ERR_MSG_OK, tempFilePaths: [], tempFiles: [] } : res
    })
}

export function chooseAndUploadFile(opts = { type: 'all' }) {
  if (opts.type === 'image') {
    return uploadFiles(chooseImage(opts), opts);
  } else if (opts.type === 'video') {
    return uploadFiles(chooseVideo(opts), opts);
  }
  return uploadFiles(chooseAll(opts), opts);
}


/**
 * 
 * @param {*} options 同官网
 * @returns 
 */
export function chooseImage(options) {
  return new Promise(function (resolve, reject) {
    GLOBAL.chooseImage({
      ...options,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    })
  })
}

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

export function downloadFile (options) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      ...options,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    })
  })
}