<template>
  <view class="policy-details">
    <view class="title">{{ index.title || '--'}}</view>
    <view class="subtitle">
      <view class="left">
        <text class="school">{{ info.source || '--' }}</text>
        <text class="time">{{ info.create_time || '--' }}}</text>
      </view>
      <view class="right">阅读{{ info.virtual_num}}</view>
    </view>

    <view class="textarea">
      <u-parse :content="info.content || '--'" />
    </view>

  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import { articleDetail } from "@/api/index";
export default {
  components: {
    uParse
  },
  data() {
    return {
      policy_id: '',
      info: {
        content: ''
      }
    }
  },
  onLoad(query) {
    this.policy_id = query.policy_id
  },
  mounted() {
    this.getData()
  },
  methods: {
   async getData() {
    const res = await articleDetail({ article_id: this.policy_id }) 
      if (res.code == 0) {
        this.info = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.policy-details {
  overflow: hidden;
  padding: 30rpx;
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
    margin-left: 20rpx;
  }

  .right {
    color: $text-color;
  }
}

.textarea {
  margin-top: 20rpx;
}
</style>