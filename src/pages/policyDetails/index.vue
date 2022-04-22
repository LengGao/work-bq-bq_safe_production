<template>
  <view class="policy-details">
    <view class="title">用应急管理改革硬招实招加强防汛备汛工作</view>
    <view class="subtitle">
      <view class="left">
        <text class="school">东培学堂</text>
        <text class="time">2022-18-12 18:30:00</text>
      </view>
      <view class="right">阅读888</view>
    </view>

    <view class="textarea">
      <u-parse :content="nodes.content || '--'" />
    </view>

  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import { getAnnouncementInfo } from "@/api/index";
export default {
  components: {
    uParse
  },
  data() {
    return {
      nodes: []
    }
  },
  mounted() {
    this.getData()

  },
  methods: {
    // 获取数据
   async getData() {
      const res = await getAnnouncementInfo({ id: 717 }) 
        if (res.code == 0) {
          this.nodes = res.data
        }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.policy-details {
  overflow: hidden;
  padding: 20rpx;
}

.title {
  font-size: $font-size-xlg;
}

.subtitle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  font-size: $font-size-sm;

  .school {
    color: $color-primary;
  }

  .time {
    color: $text-color-grey;
  }

  .right {
    color: $text-color;
  }
}

.textarea {
  margin-top: 20rpx;
}
</style>