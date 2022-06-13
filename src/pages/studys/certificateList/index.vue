<template>
  <view class="certificate-list">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="header">
      <view class="option" v-for="(item,index) in actives" :key="index" :class="active === index ? 'active' : ''"
            @click="() => onChange(index)">
        {{ item.name }}
      </view>
    </view>

    <view class="cource-list" v-if="active === 0">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true"
                     :topbar="true" :safearea="true">
        <CardRow v-for="course in courseData" :key="course.id" class="cardrow-color">
          <template v-slot:cardBodyLeft>
            <view class="card-body-left">
              <image @click="() => previewImg(course.cover)" :src="course.cover" class="img-size-lg" mode="aspectFill"/>
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="card-body-right">
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
                  <view class="tag tag-two-full" v-if="course.learning_progress >= 100"
                        @click="() => buildLearnCert(course.id)">生成证书</view>
                  <view class="tag tag-three-full" v-else-if="course.learning_progress <= 0"></view>
                  <view class="tag tag-one-full" v-else @click="() => onViewCertificate(cert_url)">查看证书</view>
                </view>
              </view>
            </view>
          </template>
        </CardRow>
      </mescroll-body>
    </view>

    <view v-else class="learn-certificate">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true"
                     :topbar="true" :safearea="true">
        <view class="list-item" v-for="item in certificateData" :key="item.id">
          <view class="list-item-title">{{ item.title }}</view>
          <view class="list-item-time">获取时间：{{ item.time }}</view>
          <view class="list-item-image-box">
            <image class="image" @click="() => previewImg(item.url)" :src="item.url" mode="aspectFill" />
          </view>
          <view class="list-item-save">
            <button class="btn-primary" @click="() => onViewCertificate(item.url)">查看证书</button>
          </view>
        </view>
      </mescroll-body>
    </view>

    <uni-popup ref="popup-progress" class="certificate-detail" :is-mask-click="false">
      <view class="main">
        <view class="progress-title">您的证书正在生成</view>
        <progress class="progress" :percent="percent" activeColor="#199fff" :border-radius="6" :duration="10" show-info
                   @activeend="activeend" />
      </view>
    </uni-popup>

    <uni-popup ref="popup-certificate" class="certificate-detail" :is-mask-click="false">
      <view class="main">
        <view class="section">
          <view class="hader">太好啦，您的证书已生成</view>
          <view class="certificate">
            <image class="certificate" :src="downloadUrl" />
          </view>
          <view class="close-icon">
            <uni-icons type="clear" size="56rpx" @click="onClose(2)"/>
          </view>
        </view>
        <view class="footer">
          <button class="btn-primary">请长安图片保存 </button>
        </view>
      </view>
    </uni-popup>

  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import CustomHeader from "@/components/custom-header"
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import NoData from "@/components/noData/index"
import { buildLearnCert } from "@/api/course"
import { userCourseList, userCertList } from '@/api/user'


export default {
  mixins: [MescrollMixin],
  components: {
    CardRow,
    NoData,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '我的课程证书',
      active: 0,
      actives: [{ name: '学习课程', value: 0 }, { name: '我的证书', value: 1 }],
      up: { page: { num: 0, size: 1 } },

      courseData: [],
      certificateData: [],

      percent: 0,
      timer: 0,
      downloadTask: null,
      downloadUrl: ''
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
    onViewCertificate(url) {
      if (url) this.downloadUrl = url
      this.$refs['popup-certificate'].open('center')
    },
    onClose(target) {
      if (target === 1) {
        this.$refs['popup-progress'].close()
      } else {
        this.$refs['popup-certificate'].close()
      }
    },
    generator(url) {
      this.timer = setInterval(() => {
        this.percent = this.percent + 10
        if (this.percent >= 100) this.onActiveend();
      }, 100)
    },
    onActiveend() {
      if (this.percent >= 100) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.onClose(1)
      this.onViewCertificate()
    },
    reloadList(type) {
      this.mescroll.resetUpScroll(true)
    },
    downCallback() {
      this.mescroll.resetUpScroll(true)
    },
    async upCallback(page) {
      const data = {
        page: page.num,
        page_size: page.size,
      }

      let curPageData, curPageLen, totalSize, res
      if (this.active) {
        res = await userCertList(data)
        curPageData = res.data.data;
        curPageLen = curPageData.length;
        totalSize = res.data.total;
        if (page.num == 1) this.certificateData = [];
        this.certificateData = this.certificateData.concat(curPageData);
      } else {
        res = await userCourseList(data)
        if (res.code !== 0) return this.mescroll.endBySize(0, 0);
        curPageData = res.data.data;
        curPageLen = curPageData.length;
        totalSize = res.data.total;
        if (page.num == 1) this.courseData = [];
        this.courseData = this.courseData.concat(curPageData);
      }

      this.mescroll.endBySize(curPageLen, totalSize);
    },
    // 生成证书
    async buildLearnCert(id) {
      this.$refs['popup-progress'].open('center')
      let res = await buildLearnCert({ course_id: id })
      if (res.code === 0) {
        this.downloadUrl = res.data.url
        this.generator()
      } else {
        uni.showToast({ title: '证书生成失败', icon: 'name' })
        this.onClose(1)
      }
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
  padding: 20rpx 0;
  background-color: $bg-color-grey;

  .cardrow-color {
    margin-top: 20rpx;
    padding: 30rpx;
    background-color: #fff;
  }

  .card-body-left {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    flex: 1;
    width: $img-size-width-md;
  }

  .img-size-lg {
    width: 230rpx;
    height: 140rpx;
  }

  .card-body-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex: 3 1 0;
    height: 100%;
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
    align-items: center;
    width: 100%;
    font-size: $font-size-sm;
    color: $text-color-grey;

    .cost {
      font-size: $font-size-sm;
    }
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
    position: relative;
    top: -4rpx;
    padding: 6rpx;
    font-size: $font-size-sm;
  }

  .tag-one {
    padding: 0;
    color: $color-primary;
  }

  .tag-two {
    color: $color-success;
    // border: 2rpx solid $color-success;
  }

  .tag-three {
    color: $text-color-grey;
    // border: 2rpx solid $text-color-grey;
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

      .btn-primary {
        font-size: 28rpx;
        color: #fff;
        background-color: #199fff;
      }
    }
  }
}

.progress {
  width: 600rpx;
}

.progress-title {
  font-size: 28rpx;
  color: #fff;
}

::v-deep .uni-progress-info {
  color: #fff;
}
.certificate-detail {

  .close-icon {
    margin-top: 20rpx;
    text-align: center;
  }

  .footer {
    position: relative;
    top: 20vh;

    .btn-primary {
      font-size: 28rpx;
      color: #fff;
      background-color: #199fff;
    }
  }
}
</style>