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
        <button @click="onClickComments" class="comments-btn">
          <text style="font-size: 24rpx;">我要评价</text>
        </button>
      </view>
    </view>

    <view class="rate-tag">
      <button v-for="(tag, i) in tags" :key="i" size="mini" class="tag">
        <text class="tag-text">{{ tag.text }} ({{ tag.num }})</text>
      </button>
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

  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: 2.5,
      rateForm: {
        tags: [],
        star: 0,
        remark: '',
      },
      tags: [
        { text: '刀剑神域', num: 11 },
        { text: 'overlord', num: 10 },
        { text: '从零开始的异世界生活', num: 12 }
      ],
      comments: [
        { id: 1, name: '周杰伦', content: '错哦哎呦不错哦', rate: 3, time: '1111-11-11 11::11:11', avator: 'https://img2.baidu.com/it/u=1347252749,346830019&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
        { id: 2, name: '周杰伦', content: '哎呦不错哦', rate: 1, time: '2012-11-11 11:11:11', avator: 'https://img2.baidu.com/it/u=1347252749,346830019&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
        { id: 3, name: '周杰伦', content: '哎呦不错哦', rate: 2, time: '2012-11-11 11:11:11', avator: 'https://img2.baidu.com/it/u=1347252749,346830019&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' }
      ]
    }
  },
  methods: {
    onChange(e) {
      console.log('rate发生改变:' + JSON.stringify(e))
    },
    onClickComments() {
      this.$emit('openComment')
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
      padding-left: 24rpx;
      padding-right: 24rpx;
      font-size: $font-size-sm;
      color: #fff;
      border-radius: 24rpx;
      background-color: #199fff;
    }
  }
}


.rate-tag {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 18rpx 30rpx;

  .tag {
    margin: 12rpx;
    color: #000;
    font-size: $font-size-sm;
    background-color: #f8f8f8;

    &-text {
      font-size: $font-size-sm;
      color: #777;
    }
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