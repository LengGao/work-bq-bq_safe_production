<template>
  <view class="rate">
    <view class="rate-all">
      <view class="rate-left">
        <view class="score">{{ value }}</view>
        <view class="rate-all-comments">
          <view class="comments-num">36条贫家</view>
          <uni-rate v-model="value" @change="onChange" size="48rpx" allowHalf readonly />
        </view>
      </view>

      <view class="right">
        <button @click="onClickComments" type="primary" class="comments-btn">
          我要评价
        </button>
      </view>
    </view>

    <view class="rate-tag">
      <uni-tag v-for="(tag, i) in tags" :key="i" :text="`${tag.text}(${tag.num})`" class="tag" disabled />
    </view>

    <view class="comments">
      <view class="comments-item" v-for="comment in comments" :key="comment.id">
        <view class="comments-user">
          <image :src="comment.avator" mode="aspectFit" class="avator" />
        </view>
        <view class="comments-content">
          <text class="username">{{ comment.name }}</text>
          <text class="content">{{ comment.content }}</text>
        </view>
        <view class="comments-rate">
          <view class="rate">
            <uni-rate :value="comment.rate" @change="onChange" size="36rpx" allowHalf readonly />
            <text class="commen-time">{{comment.time}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 
<i-modal visible="{{ visible2 }}" bind:ok="handleClose2" bind:cancel="handleClose2">
    <view class="model-title">这节课有收获吗？</view>
    <view class="starts">
        <i-cell title="自定义星星大小">
            <i-rate bind:change="onChange2" value="{{starIndex2}}" size="50"></i-rate>
        </i-cell>
    </view>
    <view class="pricesOfstart">{{ starIndextext }}</view>
    <view class="tip-wrapper">
        <view class="tipsOftip {{item.chooseOrNot == item.id?'tipsOftipColor' : ''}} " wx:for="{{ tips }}" wx:key="index" catchtap='chooseTips' data-index='{{ item.id }}'>
            {{ item.name }}
        </view>
    </view>
    <view class="fellings" wx:if='{{visible2}}'>
        <i-panel title="基础用法">
            <i-input value="{{ value2 }}" type="textarea" placeholder="说一说听课感受吧（最多输入80字）" maxlength="80" bind:change='changes' />
        </i-panel>
    </view>
    <view class="lunchYourcomm" bindtap='sumbitComment'>发表评论</view>
    <view class="closings" catchtap='handleClose2'>
        <image class="closing" src="https://minproimg.oss-cn-hangzhou.aliyuncs.com/images/closeing.png" />
    </view>
</i-modal> -->

  </view>
</template>

<script>
export default {
  data() {
    return {
      value: 2.5,
      tags: [
        { text: '刀剑神域', num: 11 },
        { text: 'overlord', num: 10 },
        { text: '从零开始的异世界生活', num: 12 }
      ],
      comments: [
        { id: 1, name: '周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦周杰伦', content: '哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦哎呦不错哦', rate: 3, time: '1111-11-11 11::11:11', avator: '/static/logo.png' },
        { id: 2, name: '周杰伦', content: '哎呦不错哦', rate: 1, time: '1111-11-11 11::11:11', avator: '/static/logo.png' },
        { id: 3, name: '周杰伦', content: '哎呦不错哦', rate: 2, time: '1111-11-11 11::11:11', avator: '/static/logo.png' }
      ]
    }
  },
  methods: {
    onChange(e) {
      console.log('rate发生改变:' + JSON.stringify(e))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.rate-all {
  padding: 33rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .rate-left {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    .score {
      font-size: 64rpx;
      color: #dd524d;
    }

    .rate-all-comments {
      margin-left: 20rpx;
    }

    .comments-num {
      font-size: $font-size-sm;
      line-height: calc(2 * $font-size-sm);
    }
  }

  .right {
    .comments-btn {
      font-size: $font-size-sm;
      border-radius: 24rpx;
    }
  }
}

.rate-tag {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0rpx 30rpx 30rpx;

  .tag {
    margin: 16rpx;
    padding: 8rpx;
    color: #000;
    font-size: $font-size-sm;
    background-color: #f8f8f8;
  }
}

.comments {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-top: $logan-border-spacing-md;

  &-item {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
    padding: 24rpx 20rpx;
    width: calc(100% - 40rpx);
    border-top: $logan-border-spacing-md-sm;
  }

  &-user {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  &-content {
    display: flex;
    flex-direction: column;
    margin: 0 20rpx;
    font-size: $font-size-sm;
    color: $text-color;
    flex: 4;

    .content {
      margin-top: 20rpx;
    }  
  }

  &-rate {
    display: flex;
    flex-direction: columns;
    align-items: center;
    color: $text-color-grey;
  }

  &-time {
    font-size: $font-size-sm;
  }

  .avator {
    width: $img-size-sm;
    height: $img-size-sm;
    border-radius: 50%;
  }
}
</style>