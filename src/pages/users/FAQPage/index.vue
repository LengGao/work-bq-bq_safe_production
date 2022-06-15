<template>
  <view class="policy-details">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="main">
      <view class="title">{{ info.title || '--'}}</view>
      <view class="hr"></view>
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
      defaultTitle: '常见问题',
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
  font-size: 32rpx;
  color: #199fff;
}

.hr {
  margin-top: 30rpx;
  border-bottom: 1rpx dashed #c8c7cc;
}

.textarea {
  margin-top: 20rpx;
  font-size: 28rpx;
  padding: 0 30rpx;
  line-height: 2;
  text-indent: 2em;
}

::v-deep uni-image {
  margin-left: -2em;
}
</style>