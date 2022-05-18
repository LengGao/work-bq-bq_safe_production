<template>
  <view class="u-video">
    <div id=”aliplayer“></div>
  </view>
</template>

<script>
import { 
  courseGetVideoAuth
} from '@/api/course'
export default {
  name: 'u-video',
  data() {
    return {
      player: null,
      startTime: null,
      intervalId: null,
      time: 1000 * 10,
      currentPlayLessonId: null,
      currentPlayChapterId: null,
    }
  },
  methods: {
    //定时发送数据
    intervalSend() {
      // 定时器开始前先请空，再开启
      intervalId && clearInterval(intervalId)
      intervalId = setInterval(() => {
        sendData()
      }, time)
    },
    // 暂停发送
    stopSend() {
      if (intervalId) {
        // 清空定时发送时间，
        clearInterval(intervalId)
        intervalId = null
        // 发送暂停时的播放时间
        sendData()
      }
    },

    // 发送数据
    endData() {
      let endTime = player.getCurrentTime()
      // 大于 绝对值的1.5倍就不发送 
      const isSend = Math.abs(endTime - startTime) <= time / 1000 * 1.5 && startTime != endTime
      if (isSend) {
        var rel = $.fetch("{:url('course/recordLearn')}", {
          lesson_id: currentPlayLessonId,
          start_second: startTime + '',
          end_second: endTime + ''
        }, "GET");
        if (rel.error_code !== 0) {
          location.href = `/user/error/index?error=${rel.message}`
        }
        if (rel.error_code === 0 && rel.data.redirect_url) {
          location.href = rel.data.redirect_url
        }
      }
      startTime = endTime
    }

  }
}
</script>

<style>
</style>