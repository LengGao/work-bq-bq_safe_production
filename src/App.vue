<script>
export default {
  onLaunch: function () {
    // console.log('App Launch')
    /* #ifdef H5 */
    let head = document.getElementsByTagName('head')[0]
    let aliplayerCss = document.createElement('link') //创建一个link标签
    aliplayerCss.rel = 'stylesheet'
    // aliplayerCss.href = '/static/js-sdk/aliplayer.css' // 下载下来的本地样式有问题
    aliplayerCss.href = 'https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/aliplayer-min.css'
    head.appendChild(aliplayerCss)

    let aliplayer = document.createElement('script')
    aliplayer.type = 'text/javascript'
    // aliplayer.src = '/static/js-sdk/aliplayer.js'
    aliplayer.src = 'https://g.alicdn.com/de/prismplayer/2.9.3/aliplayer-min.js'
    aliplayer.async = true
    head.appendChild(aliplayer)

    uni.navigateBack = (details = 0) => {      
      if (details) {
        history.go( 0 - details )
      } else {
        history.back() 
      }
    }
    /* #endif */

  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  }
}
</script>

<style>
/*每个页面公共css */
@import "@/assets/icon/iconfont.css";
/* 页面高度100% */
page {
  height: 100%;
}
</style>
