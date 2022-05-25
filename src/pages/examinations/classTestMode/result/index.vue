<template>
  <view class="result">
    <view class="header">
      <view v-if="pass" class="header-row-one success">
        <uni-icons custom-prefix="iconfont" type="icon-gou" color="#49D204" size="64rpx" style="margin-bottom: 20rpx" />
        考试得分：{{ grader }}分
      </view>
      <view v-else class="header-row-one error">
        <uni-icons custom-prefix="iconfont" type="icon-chacha" color="" size="96rpx" style="margin-bottom: 20rpx" />
        考试得分：{{ grader }}分
      </view>

      <view class="header-row-two">
        {{ pass ? victoryText : defeatText }}
      </view>
    </view>

    <view class="main">
      <view class="gird">
        <view class="box" v-for="(item, index) in data" :key="index" :class="item.right ? 'success' : 'error'">
          {{ index + 1 }}
          <uni-icons v-if="item.is_right" custom-prefix="iconfont" type="icon-zhengquetishitianchong"  
          color="#49D204" size="36rpx" style="position: absolute; right: -4rpx; bottom: -8rpx;" />
          <uni-icons v-else custom-prefix="iconfont" type="icon-cuowutishitianchong" 
          color="#F76510" size="36rpx" style="position: absolute; right: -4rpx; bottom: -8rpx;" />
        </view>
      </view>
    </view>

    <view class="footer">
      <button class="footer-first" plain @click="onAnalysis">查看解析</button>
      <view class="footer-second" v-if="pass">
        <button class="footer-second-btn" @click="onNext">继续学习</button>
      </view>
      <view class="footer-second" v-else>
        <button class="footer-second-btn" @click="() => onRestart('study')">再看一次</button>
        <button class="footer-second-btn" @click="() => onRestart('examination')">再考一次</button>
      </view>
    </view>

  </view>

</template>

<script>
import { practiceAnalyse } from "@/api/question";

export default {
  name: 'result',
  data() {
    return {
      victoryText: '恭喜您，成功通过本次考试！',
      defeatText: '很遗憾，您并没有通过本次考试！',
      grader: 0,
      data: {},
      practice_id: '',
    }
  },
  computed: {
    pass() {
      return this.grader >= 80 ? true :false 
    },
  },
  onLoad(options) {
    let { practice_id, lesson_id, grader } = options
    this.practice_id = practice_id
    this.lesson_id = lesson_id
    this.grader = grader
    this.getData()
  },
  methods: {
    onAnalysis() {
      let url = `/pages/examinations/classTestMode/analysis/index`
      let query = `?practice_id=${this.practice_id}&grader=${this.grader}`
      uni.navigateTo({ url: url + query})
    },
    onNext() {
      let pages = getCurrentPages()
      console.log("pages",pages);
      let url = `/pages/studys/courseDetail/index`
      let query = `?lesson_id=${this.lesson_id}`
      uni.navigateTo({ url: url + query})  
    },
    onRestart(type) {
      let url = ''
      let query = ''
      if (type === 'study') {
        url = `/pages/studys/courseDetail/index`
        query = `?lesson_id=${this.lesson_id}`
      } else {
        url = `/pages/examinations/classTestMode/answer/index`
        query = `?lesson_id=${this.lesson_id}`
      }
        uni.navigateTo({ url: url + query})
    },
    async getData() {
      let data = { practice_id: this.practice_id }
      let res = await practiceAnalyse(data)
      if (res.code === 0) {
        this.data = res.data.question
        this.data = this.data.concat(res.data.question)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.result {
  overflow: hidden;
  width: 100%;
}

.success {
  color: #49D204;
  border-color:#49D204; 
}

.error {
  color: #F76510; 
  border-color: #F76510; 
}

.header {
  margin-top: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  &-row-one {
    display: flex;
    flex-direction: column;
    align-items: center;
    // width: 540rpx;
    font-size: 46rpx;
    letter-spacing: 2rpx;
    font-weight: 600;
  }

  &-row-two {
    margin: 24rpx auto 0;
    letter-spacing: 3rpx;    
    font-size: 36rpx;
    color: #999;
  }
}

.main {
  height: 620rpx;
  overflow-y: auto;
  margin-top: 30rpx;
  padding: 40rpx 60rpx 0 60rpx;

  .gird {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: minmax(80rpx, auto);
    grid-gap: 40rpx;;
    gap: 40rpx;  
  }

  .box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width:  80rpx;
    height: 80rpx;
    font-size: 36rpx;
    border-width: 2rpx;
    border-style: solid;
    border-radius: 50%;
  }
}

.footer {
  position: absolute;
  bottom: var(--window-bottom);
  padding: 0 60rpx;
  width: 100%;
  box-sizing: border-box;

  &-first {
    width: 100%;
    color: $color-primary;
    font-size: 32rpx;
    font-weight: 700;
    border: 2rpx solid $color-primary;
  }

  &-second {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 40rpx;
    width: 100%;

    &-btn {
      width: 100%;
      color: #fff;
      font-size: 32rpx;
      font-weight: 700;
      background-color: $color-primary;
      border: 2rpx solid $color-primary;
    }

    &-btn:nth-of-type(2) {
      margin-left: 20rpx;
    }
  }
}
</style>