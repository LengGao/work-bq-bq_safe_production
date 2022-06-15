<template>
  <view class="policy-details">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="main">
      <view class="title">{{ info.title || '--'}}</view>

      <view class="subtitle">
        <view class="left">
          <text class="school">{{ info.source || '--' }}</text>
          <text class="time">{{ info.create_time || '--' }}</text>
        </view>

        <view class="right">
          <uni-icons type="eye" size="28rpx" color="#BBBBBB"  style="margin-right: 8rpx;" />
          {{ info.virtual_num}}
        </view>
      </view>
    </view>

    <view class="textarea">
      <u-parse :content="info.content || '--'" />
    </view>
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import CustomHeader from "@/components/custom-header"
import { articleDetail } from "@/api/index";
export default {
  components: {
    uParse,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '政策详情',
      article_id: '',
      info: { content: '' }
    }
  },
  onLoad(query) {
    this.article_id = query.article_id
    this.getData()

  },
  methods: {
    async getData() {
      const res = await articleDetail({ article_id: this.article_id })
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
  width: 100%;
  overflow: hidden;
}

.main {
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
  padding: 20rpx 0;
  font-size: $font-size-sm;
  border-bottom: 2rpx dashed #c8c7cc;

  .school {
    color: $color-primary;
  }

  .time {
    color: $text-color-grey;
    margin-left: 20rpx;
  }

  .right {
    color: $text-color-grey;
  }
}

.textarea {
  margin-top: 20rpx;
  padding: 0 30rpx;
  line-height: 2;
  text-indent: 2em;
  ::v-deep .p {
    line-height: 2;
    text-indent: 2em;
  }
}

</style>