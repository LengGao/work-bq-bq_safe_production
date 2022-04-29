<template>
  <view class="user-cource-list">
    <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp">
        <CardRow v-for="course in courses" :key="course.id">
          <template v-slot:cardBodyLeft>
            <view class="logan-card-body-left">
              <image @click="() => previewImg(course.thumb)" :src="course.thumb" class="logan-img-size-lg" mode="aspectFit" />
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="logan-card-body-right" @click="() => onClickRecommend()">
              <view class="logan-card-right-top">
                <text>{{ course.title }}</text>
              </view>
              <view class="logan-card-right-center">{{ course.time }}</view>
              <view class="logan-card-right-footer">
                <view class="audience">
                  <uni-icons type="person" size="24rpx" />
                  <text style="margin-left: 10rpx">{{ course.num }}人看过</text>
                </view>
                <view class="cost">
                  <view v-if="course.money > 0">
                    <text class="present-price">￥{{ course.money }}</text>
                    <text class="original-price">{{ course.oldMoney }}</text>
                  </view>x
                  <view class="tag" :class="course.type">学习进度 {{ course.prpress }}%</view>
                </view>
              </view>
            </view>
          </template>
        </CardRow>
    </mescroll-body>
  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  components: { CardRow },
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      courses: [
        { id: 1, thumb: "/static/img/study_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 1, tag: "已完成", prpress: 800, type: 'tag-one' },
        { id: 2, thumb: "/static/img/study_cource2.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 1, tag: "未开始", prpress: 100, type: 'tag-two' },
        { id: 3, thumb: "/static/img/study_cource3.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 1, tag: "未开始", prpress: 0, type: 'tag-three' }
      ],
    }
  },
  methods: {
    // 下拉
    onDown() {
      this.mescroll.endBySize(1, 1)
    },
    // 上拉
    onUp() {
      this.mescroll.endBySize(1, 1)
    },
    // 点击推荐课程
    onClickRecommend() {
      uni.navigateTo({ url: '/pages/courseDetail/index' })
    },
    // 预览
    previewImg(url) {
      uni.previewImage({ urls: [url] })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.user-cource-list {
  width: 100%;
  padding: 24rpx 0;

  .logan-card-right-center {
    font-size: $font-size-sm;
  }

  .logan-card-right-footer {
    align-items: baseline;
    font-size: $font-size-sm;
  }

  .audience {
    color: $color-primary;
    font-size: $font-size-sm;
  }

  .present-price {
    font-size: $font-size-lg;
    color: $color-warning;
  }

  .original-price {
    margin-left: 8rpx;
    font-size: $font-size-base;
    text-decoration: line-through #999;
  }

  .tag {
    font-size: 24rpx;
    font-weight: normal;
  }

  .tag-one {
    color: $color-primary;
    border-color: $color-primary;
  }

  .tag-two {
    color: $color-success;
    border-color: $color-success;
  }

  .tag-three {
    color: $text-color-grey;
    border-color: $text-color-grey;
  }
}

</style>