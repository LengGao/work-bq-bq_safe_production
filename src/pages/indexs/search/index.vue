<template>
  <view class="search">
    <custom-header :title="defaultTitle"></custom-header>

    <uni-search-bar v-model="keyword" :radius="24" placeholder="搜索您感兴趣的课程" @confirm="onSearch" @clear="onClear"
                    @cancel="onCancel"></uni-search-bar>
    <view class="history" v-if="showRecond">
      <view class="head">
        <view class="title">搜索历史</view>
        <uni-icons type="trash-filled" size="48rpx" color="#999" @click="onClearHistry" />
      </view>
      <view class="history-list">
        <button @click="onCLickHistory('his', index)" v-for="(history, index) in historys" :key="index" class="btn">
          <text>{{ history }}</text>
        </button>
      </view>
    </view>
    <view class="hot" v-if="showRecond">
      <view class="head">
        <view class="title">热门搜索</view>
      </view>
      <view class="hot-list">
        <button @click="onCLickHot('hot', index)" v-for="(hot, index) in hots" :key="index" class="btn">
          <text>{{ hot }}</text>
        </button>
      </view>
    </view>

    <view class="cources-list" v-if="!showRecond">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true"
                     :topbar="true" :safearea="true">
        <view class="course-list-container">
          <view class="course-item" v-for="item in cources" :key="item.id">
            <view class="course-item-cover">
              <view class="course-tag course-tag--success" v-if="item.price_type === 0">免费课</view>
              <view class="course-tag course-tag--primary" v-else-if="item.price_type === 1">认证课</view>
              <view class="course-tag" v-else>其他课</view>

              <image class="course-img" :src="item.cover" mode="aspectFit" @click="() => previewImg(item.cover)" />
            </view>
            <view class="course-item-content" @click="() => toDetails(item.id)">
              <view class="course-name">{{ item.title }}</view>
              <view class="course-time">
                {{ item.chapter_count }}章
                {{ item.lesson_count }}课时
              </view>
              <view class="course-other">
                <view class="course-other-count">
                  <uni-icons type="person-filled" color="#fff" class="icon-person" size="32rpx"></uni-icons>
                  {{ item.learn_count }} 人在学
                </view>
                <view class="cost">
                  <uni-tag class="tag" v-if="item.duration" size="small" :text="item.duration + '分钟'" inverted />
                </view>
              </view>
            </view>
          </view>
        </view>
      </mescroll-body>
    </view>

  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import CustomHeader from "@/components/custom-header"
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { browser } from '@/mixins/index'
import {
  hotWord,
  delHistoryWord,
  courseList,
} from '@/api/index'

export default {
  mixins: [browser, MescrollMixin],
  components: {
    CardRow,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '安培课堂',
      showRecond: true,
      keyword: '',
      region_id: '',
      up: {
        page: {
          num: 0,
          size: 20,
          time: 500,
        },
      },

      cources: [],
      historys: [],
      hots: [],
    }
  },
  onLoad() {
    this.region_id = this.$store.getters.region.id
    this.getHotWord()
  },
  methods: {
    // 点击搜索历史
    onCLickHistory(type, index) {
      this.keyword = this.historys[index]
      this.showRecond = false
      this.reloadList()
    },
    // 清空搜索历史
    async onClearHistry() {
      this.historys = []
      delHistoryWord()
    },
    // 点击热门搜索
    onCLickHot(type, index) {
      this.keyword = this.hots[index]
      this.showRecond = false
      this.reloadList()
    },
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    toDetails(id) {
      let url = '/pages/studys/courseDetail/index'
      let query = `?course_id=${id}`
      uni.navigateTo({ url: url + query })
    },
    onSearch({ value }) {
      this.showRecond = false
      this.keyword = value
      this.reloadList()
    },
    onCancel() {
      this.showRecond = true
      this.reloadList()
    },
    onClear() {
      this.showRecond = true
      this.reloadList()
    },
    reloadList(type, val) {
      this.downCallback()
      this.getHotWord()
    },
    downCallback() {
      if (this.mescroll) {
        this.mescroll.resetUpScroll(true)
      }
    },
    async upCallback(page) {
      const data = {
        page: page.num,
        page_size: page.size,
        keyword: this.keyword,
        region_id: this.region_id
      }
      const res = await courseList(data)
      if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      let curPageData = res.data.data;
      let curPageLen = curPageData.length;
      let totalSize = res.data.total;
      if (page.num == 1) this.cources = [];
      this.cources = this.cources.concat(curPageData);
      this.mescroll.endBySize(curPageLen, totalSize);
    },

    async getHotWord() {
      let res = await hotWord()
      if (res.code === 0) {
        this.hots = res.data.hot_word
        this.historys = res.data.history_word
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.search {
  width: 100%;
  overflow: hidden;
}

.history {
  display: flex;
  flex-direction: column;
  .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx;

    .title {
      font-size: $font-size-md;
    }
  }
}

.hot {
  display: flex;
  flex-direction: column;

  .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx;

    .title {
      font-size: $font-size-md;
    }
  }
}

.history-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 16rpx;
  width: 100%;
}

.hot-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 16rpx;
  width: 100%;
}

.btn {
  overflow: visible;
  flex: 1 1 1;
  margin: 8rpx 10rpx;
  font-size: $font-size-base;
  color: $text-color-default;
  background-color: #fff;
}

.course-list {
  background-color: #f8f8f8;
  &-header {
    z-index: 990;
    position: sticky;
    top: var(--window-top);
    display: flex;
    align-items: center;
    background-color: #fff;
    .picker {
      flex: 1;
    }
  }
  &-container {
    padding: 35rpx 20rpx 0;
    .course-item {
      background-color: #fff;
      border-radius: 12rpx;
      padding: 24rpx 16rpx;
      display: flex;
      margin-bottom: 20rpx;
      &-cover {
        position: relative;
        line-height: 0;

        .course-img {
          width: 228rpx;
          height: 130rpx;
        }

        .course-tag {
          line-height: initial;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          padding: 5rpx 24rpx;
          background-color: $uni-color-primary;
          color: #fff;
          font-size: $uni-font-size-sm;
          border-top-left-radius: 12rpx;
          border-bottom-right-radius: 12rpx;
          &--success {
            background-color: $uni-color-success;
          }
          &--primary {
            background-color: #199fff;
          }
        }
        image {
          border-radius: 12rpx;
          width: 228rpx;
          height: 132rpx;
        }
      }
      &-content {
        margin-left: 20rpx;
        flex: 1;
        display: flex;
        line-height: 1;
        flex-direction: column;
        justify-content: space-between;
        .course-name {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #444444;
          font-size: $uni-font-size-base;
        }
        .course-time {
          font-size: $uni-font-size-sm;
          color: #bbbbbb;
        }
        .course-other {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: $uni-font-size-base;
          .icon-person {
            background-color: #dfecff;
            border-radius: 50%;
            margin-right: 16rpx;
          }
          &-count {
            color: $uni-color-primary;
            font-size: $uni-font-size-sm;
          }
          .cost {
            .tag {
              position: relative;
              top: -4rpx;
              color:  #fff;
              background-color: #b23145;
              border-color: #b23145;
            }
          }
        }
      }
    }
  }
}

::v-deep .uni-searchbar__box {
  justify-content: flex-start;
}
</style>