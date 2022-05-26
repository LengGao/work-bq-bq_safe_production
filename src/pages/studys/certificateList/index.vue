<template>
  <view class="certificate-list">
    <view class="header">
      <view class="option" v-for="(item,index) in actives" :key="index" :class="active === index ? 'active' : ''"
            @click="() => onChange(index)">
        {{ item.name }}
      </view>
    </view>

    <view class="cource-list" v-if="active === 0">
      <template v-if="courseData.length">
        <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up"
                       :fixed="true" :topbar="true" :safearea="true">
          <CardRow v-for="course in courseData" :key="course.id" class="cardrow-color">
            <template v-slot:cardBodyLeft>
              <view class="card-body-left">
                <image @click="() => previewImg(course.cover)" :src="course.cover" class="img-size-lg"
                       mode="aspectFit" />
              </view>
            </template>
            <template v-slot:cardBodyRight>
              <view class="card-body-right" @click="() => onClickRecommend(course.id)">
                <view class="card-right-top">
                  <text>{{ course.title }}</text>
                </view>

                <view class="card-right-footer">
                  <view class="time">
                    <view class="tag tag-two" v-if="course.learning_progress >= 100">已学完</view>
                    <view class="tag tag-three" v-else-if="course.learning_progress <= 0">未开始</view>
                    <view class="tag tag-one" v-else>已学习 {{ course.learning_progress }}%</view>
                  </view>
                  <view class="cost">
                    <view class="tag tag-two-full" v-if="course.learning_progress >= 100">生成证书</view>
                    <view class="tag tag-three-full" v-else-if="course.learning_progress <= 0"></view>
                    <view class="tag tag-one-full" v-else>查看证书</view>
                  </view>
                </view>
              </view>
            </template>
          </CardRow>
        </mescroll-body>
      </template>
      <template v-else>
        <NoData />
      </template>
    </view>

    <view v-else class="learn-certificate">
      <template v-if="certificateData.length">
        <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp" :height="1000">
          <view class="list-item" v-for="item in certificateData" :key="item.id">
            <view class="list-item-title">{{ item.name }}</view>
            <view class="list-item-time">获取时间：{{ item.time }}</view>
            <view class="list-item-image-box">
              <image class="image" @click="() => previewImg(item.thumb)" :src="item.thumb" mode="aspectFit" />
            </view>
            <view class="list-item-save">长按证书保存</view>
          </view>
        </mescroll-body>
      </template>
      <template v-else>
        <NoData />
      </template>
    </view>
  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import NoData from "@/components/noData/index"

export default {
  mixins: [MescrollMixin],
  components: {
    CardRow,
    NoData
  },
  data() {
    return {
      active: 0,
      actives: [{ name: '学习课程', value: 0 }, { name: '我的证书', value: 1 }],
      up: { page: { num: 0, size: 1 } },
      courseData: [
        { id: 26, cover: "/static/img/study_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "已完成", learning_progress: 80, type: 'tag-one' },
        { id: 27, cover: "/static/img/study_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "未开始", learning_progress: 100, type: 'tag-two' },
        { id: 28, cover: "/static/img/study_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "未开始", learning_progress: 0, type: 'tag-three' }
      ],
      certificateData: [
        { id: 1, name: '2022年复工复产线上培训', time: '2022-04-20 21:00:00', thumb: '../static/learnCertificate.png' },
        { id: 2, name: '2021年安全管理员线上培训', time: '2022-04-20 21:00:00', thumb: '../static/learnCertificate.png' }
      ]
    }
  },
  methods: {
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    onChange(index) {
      this.active = index
      this.reloadList()
    },
    onClickRecommend(id) {
      uni.showToast({ title: '尽情期待', icon: 'none' })
    },
    reloadList(type) {
      this.downCallback()
    },
    downCallback() {
      this.mescroll.endBySize(1, 1);
      // this.mescroll.resetUpScroll(true)
    },
    async upCallback(page) {
      // const data = {
      //   page: page.num,
      //   page_size: page.size,
      //   region_id: this.region_id,
      //   category_id: this.category_id,
      //   price_type: this.type_id
      // }
      // const api = this.active ? courseList : courseList
      // const res = await api(data)
      // if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      // let curPageData = res.data.data;
      // let curPageLen = curPageData.length;
      // let totalSize = res.data.total;
      // if (page.num == 1) this.courseData = [];
      // this.courseData = this.courseData.concat(curPageData);
      // this.mescroll.endBySize(curPageLen, totalSize);
      this.mescroll.endBySize(1, 1);
    },

  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.certificate-list {
  height: 100%;
  background-color: #f8f8f8;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;

  .option {
    margin-top: 40rpx;
    margin-left: 30rpx;
    padding: 16rpx 30rpx;
    font-size: $font-size-sm;
    color: #333;
    background-color: #fff;
  }

  .active {
    color: $color-primary;
  }
}

.cource-list {
  width: 100%;
  padding: 24rpx 0;
  background-color: $bg-color-grey;

  .cardrow-color {
    margin-top: 20rpx;
    background-color: #fff;
  }

  .card-body-left {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1 1 1;
    height: 100%;
    width: $img-size-width-md;
  }

  .img-size-lg {
    height: 140rpx;
    width: 230rpx;
  }

  .card-body-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex: 3 1 0;
    height: 140rpx;
    overflow: hidden;
    margin-left: 20rpx;
    font-size: $font-size-base;
    letter-spacing: 1rpx;
  }

  .card-right-top {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 100%;
    color: $text-color;
  }

  .card-right-center {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    font-size: $font-size-sm;
    color: $text-color-grey;
  }

  .card-right-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
    font-size: $font-size-sm;
    color: $text-color-grey;
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
    font-size: $font-size-sm;
    padding: 6rpx;
  }

  .tag-one {
    padding: 0;
    color: $color-primary;
  }

  .tag-two {
    color: $color-success;
    border: 2rpx solid $color-success;
  }

  .tag-three {
    color: $text-color-grey;
    border: 2rpx solid $text-color-grey;
  }

  .tag-one-full {
    padding: 8rpx 10rpx;
    width: 120rpx;
    text-align: center;
    font-size: $font-size-sm;
    color: #fff;
    background-color: $color-primary;
  }

  .tag-two-full {
    padding: 8rpx 10rpx;
    width: 120rpx;
    text-align: center;
    font-size: $font-size-sm;
    color: #fff;
    background-color: $color-success;
  }

  .tag-three-full {
    background-color: transparent;
  }
}

.learn-certificate {
  background-color: $bg-color-grey;
  padding: 30rpx;

  .list {
    height: 100vh;
    &-item {
      padding: 40rpx 20rpx;
      border-radius: 12rpx;
      background-color: #fff;
      margin-bottom: 40rpx;
      &-title {
        font-size: 30rpx;
        color: #303232;
        display: flex;
        align-items: center;
        &::before {
          content: "";
          width: 8rpx;
          height: 32rpx;
          background-color: $uni-color-primary;
          margin-right: 8rpx;
        }
      }
      &-time {
        padding: 14rpx;
        font-size: $uni-font-size-sm;
        color: #a0a0a0;
      }
      &-image-box {
        text-align: center;
      }
      &-save {
        text-align: center;
        font-size: $uni-font-size-sm;
        color: #a0a0a0;
      }
      &-btn {
        margin-top: 40rpx;
        color: #fff;
        background-color: $color-primary;
        border-radius: 12rpx;
      }
      .image {
        width: 100%;
        height: 446rpx;
      }
    }
  }
}
</style>