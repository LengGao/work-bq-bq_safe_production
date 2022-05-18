<script>
function loadScriptString(src) {
	var script = document.createElement('script') //创建一个script标签
	script.type = 'text/javascript'
	script.src = src
	document.getElementsByTagName('head')[0].appendChild(script)
}

function loadLinkString(src) {
	document.getElementsByTagName('head')[0].appendChild(link)
}

export default {
  onLaunch: function () {
    // console.log('App Launch')
    // # ifdef H5
    let head = document.getElementsByTagName('head')[0]
    let aliplayerCss = document.createElement('link') //创建一个link标签
    aliplayerCss.rel = 'stylesheet'
    aliplayerCss.href = '/static/js-sdk/aliplayer.css'
    head.appendChild(aliplayerCss)

    let aliplayer = document.createElement('script')
    aliplayer.type = 'text/javascript'
    aliplayer.src = '/static/js-sdk/aliplayer.js'
    aliplayer.async = true
    head.appendChild(aliplayer)
    // # endif

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
