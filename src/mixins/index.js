export const dataMixin = {

}

export const methodsMixin = {
  // 预览图片
  previewImg(url) {
    uni.previewImage({ urls: [url] })
  },
  // mescroll 初始化
  mescrollInit(callback, args) {
    this.mescroll = mescroll;
    this.mescrollInitByRef(); // 兼容字节跳动小程序
    callback && callback.apply(this, args)
  },
  // mescroll 上拉
  onUp(callback, args) {
    callback && callback.apply(this, args)
  },
  // mescroll 下拉
  onDown(callback, args) {
    callback && callback.apply(this, args)
  }

}

export const hookMixin = {
  
}

