<template>
  <view class="index">
    <!-- #ifdef MP-WEIXIN -->
    <official-account @load="onbindload" @error="onbinderror" :hidden="isHidden"></official-account>
    <!-- #endif -->
    <custom-header :title="defaultTitle" :needBack="false"></custom-header>

    <view class="filter">
      <view class="filter-left" @click="onOpenFilter">
        <uni-icons type="location" size="36rpx" color="#199fff" />
        <text class="location">{{ currLocation.region }}</text>
        <uni-icons type="bottom" size="32rpx" />
      </view>
      <view class="filter-right">
        <uni-icons type="search" size="36rpx" @click="onOpenSearch" />
      </view>
    </view>

    <view class="swiper-bar">
      <swiper :interval="2000" autoplay circular disable-touch class="swiper">
        <swiper-item v-for="swiper in swipers" :key="swiper.id" @click="() => onClickSwiperImg(swiper)"
                     :current-item-id="swiper.id" class="swiper-item">
          <image :src="swiper.banner" class="swiper-image" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </view>

    <view class="business-bar">
      <view class="logan-list-head">
        <view class="logan-list-head-left">安全生产资格培训</view>
        <view class="logan-list-head-right" @click="() => onClickAll(1)">
          <text>全部课程</text>
          <uni-icons type="forward" size="28rpx" />
        </view>
      </view>
      <view class="business">
        <view v-for="business in businesses" :key="business.id" :class="'block ' + business.type"
              @click="() => onClickCource(business.id)">
          <text class="business-text"> {{ business.title }} </text>
        </view>
      </view>
    </view>

    <view class="course-bar">
      <view class="logan-list-head">
        <view class="logan-list-head-left">推荐课程</view>
        <view class="logan-list-head-right" @click="() => onClickAll(2)">
          <text>查看全部</text>
          <uni-icons type="forward" size="28rpx" />
        </view>
      </view>

      <view class="courses-list">
        <template v-if="courses.length">
          <CardRow v-for="course in courses" :key="course.id">
            <template v-slot:cardBodyLeft>
              <view class="logan-card-body-left">
                <view class="cover-tag cover-tag--success" v-if="course.price_type === 0">免费课</view>
                <view class="cover-tag cover-tag--primary" v-else-if="course.price_type === 1">认证课</view>
                <view class="cover-tag" v-else>其他课</view>
                <image @click="() => previewImg(course.cover)" :src="course.cover" class="logan-img-size-lg" mode="aspectFill" />
              </view>
            </template>
            <template v-slot:cardBodyRight>
              <view class="logan-card-body-right" @click="() => onClickRecommend(course.id)">
                <view class="logan-card-right-top">
                  <text>{{ course.title }}</text>
                </view>
                <view class="logan-card-right-center">
                  {{ course.chapter_count }}章
                  {{ course.lesson_count }}课时
                </view>
                <view class="logan-card-right-footer">
                  <view class="audience">
                    <uni-icons type="person-filled" color="#fff" class="icon-person" size="24rpx"></uni-icons>
                    <text style="margin-left: 10rpx">{{ course.pv }}人看过</text>
                  </view>
                  <view class="cost">
                    <uni-tag class="tag" v-if="course.duration" size="small" :text="course.duration + '分钟'" inverted />
                  </view>
                </view>
              </view>
            </template>
          </CardRow>
        </template>
        <template v-else>
          <NoData position="static" />
        </template>
      </view>
    </view>

    <view class="policy-bar" v-if="policys.length">
      <view class="logan-list-head">
        <view class="logan-list-head-left">政策专栏</view>
        <view class="logan-list-head-right" @click="() => onClickAll(3)">
          <text>全部政策</text>
          <uni-icons type="forward" size="28rpx" />
        </view>
      </view>

      <view class="policy-swiper">
        <swiper @change="onChangeSwiper" :autoplay="false" circular class="swiper">
          <swiper-item v-for="policy in policys" :key="policy.id" :current-item-id="policy.id">
            <view class="swiper-item-box" @click="() => onClickPolicy(policy.id)">
              <image :src="policy.cover" class="swiper-image" mode="aspectFill" />
              <view class="swiper-text">{{ policy.title }}</view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <view class="library-bar">
      <view class="logan-list-head">
        <view class="logan-list-head-left">文库资料</view>
        <view class="logan-list-head-right" @click="onClickAll(4)">
          <text>全部资料</text>
          <uni-icons type="forward" size="28rpx" />
        </view>
      </view>

      <view class="library-list">
        <template v-if="librarys.length">
          <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.cover" @previewImg="previewImg">
            <template v-slot:cardBodyRight>
              <view class="card-body-right" @click="() => onClickLibrary(library.id)">
                <view class="card-right-top">
                  <uni-icons custom-prefix="iconfont" type="icon-file-pdf-fill" size="28rpx" color="#dd524d" />
                  <text class="library-text">{{ library.title || '--' }}</text>
                </view>
                <view class="card-right-top">
                  <text class="card-right-footer">{{ library.time || '--' }}</text>
                </view>
              </view>
            </template>
          </CardRow>
        </template>
        <template v-else>
          <NoData position="static" />
        </template>
      </view>
    </view>

    <uni-popup ref="popup" mask-background-color="#f8f8f8">
      <RegionChange @change="onChangeRegion" @close="onCloseFilter" :location="currLocation" :buttons="regions" />
    </uni-popup>

    <uni-popup ref="popup-org" mask-background-color="rgba(0, 0, 0, 0.4)" :is-mask-click="false">
      <view class="org-list">
        <view class="org-list-title">请选择要进入的机构</view>
        <view class="org-list-item" v-for="item in organizationList" :key="item.id" @click="onChoiceOrg(item)">
          {{ item.name }}
        </view>
      </view>
    </uni-popup>

  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import CustomHeader from "@/components/custom-header"
import NoData from '@/components/noData/index'
import RegionChange from './components/RegionChange'
import { mapGetters } from 'vuex'
import { browser } from '@/mixins/index'

import {
  systemRegion,
  banner,
  courseList,
  articleList,
  libraryList
} from '@/api/index'


export default {
  mixins: [browser],
  components: {
    CardRow,
    NoData,
    CustomHeader,
    RegionChange
  },
  data() {
    return {
      isHidden: false,
      isReady: false,
      isOnload: false,
      defaultTitle: '安培课堂',

      swipers: [],
      businesses: [
        { id: 1, type: "one", title: "特种作业上岗证", url: "" },
        { id: 2, type: "two", title: "两类人员安全证", url: "" },
        { id: 3, type: "three", title: "其他从业人操作证", url: "" },
      ],
      currLocation: {},
      regions: [],
      courses: [],
      policys: [],
      librarys: [],
    };
  },
  computed: {
    ...mapGetters(['organizationList'])
  },
  watch: {
    currLocation() {
      this.init()
    }
  },
  onLoad() {
    this.banner()
    this.getSystemRegion()
    this.libraryList()
  },
  onReady() {
    if (this.isReady) {
      this.needShowOrg()
    }
  },
  onShow() {
    if (this.isReady) {
      this.needShowOrg()
    } else {
      this.isReady = true
    }

    if (this.isOnload) {
      this.init()
    } else {
      this.isOnload = true
    }
  },
  methods: {
    init() {
      this.courseList()
      this.articleList()
    },
    checkLogin() {
      let userInfo = uni.getStorageSync('userInfo')
      return userInfo
    },
    checkOrgInfo() {
      let orgInfo = uni.getStorageSync('orgInfo')
      return orgInfo
    },
    needShowOrg() {
      let userInfo = this.checkLogin()
      let orgInfo = this.checkOrgInfo()
      let organizationList = this.organizationList
      let component = this.$refs['popup-org']

      if (component && userInfo.token && organizationList.length && (!orgInfo || !orgInfo.id )) {
        this.openPopup(organizationList)
      }
    },
    openPopup(list) {
      if (list && list.length) {
        if (list.length > 1) {
          uni.hideTabBar()
          this.$refs['popup-org'].open('bottom')
        } else {
          this.defaultTitle = list[0].name
          this.$store.dispatch('setOrgCurrent', list[0])
        }
      }
    },
    // 选择机构
    onChoiceOrg(item) {
      uni.showToast({ title: `欢迎进入${item.name}`, icon: 'none' })
      uni.showTabBar()
      this.defaultTitle = item.name
      this.$refs['popup-org'].close()
      this.$store.dispatch('setOrgCurrent', item)
    },
    // 点击筛选
    onOpenFilter() {
      this.$refs.popup.open('top')
    },
    // 关闭筛选
    onCloseFilter() {
      this.$refs.popup.close()
    },
    // 地区选择
    onChangeRegion(detail) {
      this.currLocation = detail
      this.$store.commit('SET_REGION', detail)
    },
    // 打开搜索页面
    onOpenSearch() {
      uni.navigateTo({ url: '/pages/indexs/search/index' })
    },
    // 轮播图点击事件
    onClickSwiperImg(swiper) {
      let url = `/pages/studys/courseDetail/index?course_id=${swiper.url}`
      uni.navigateTo({ url })
    },
    // 查看全部
    onClickAll(type) {
      let path = '', query = `?type=${type}`
      switch (type) {
        case 1:
          path = '/pages/studys/courseList/index'
          break;
        case 2:
          path = '/pages/studys/courseList/index'
          break;
        case 3:
          path = '/pages/studys/policyList/index'
          break;
        case 4:
          path = '/pages/studys/libraryList/index'
          break;
      }
      uni.navigateTo({ url: path + query })
    },
    // 点击安全生产课程
    onClickCource(courceType) {
      let path = '/pages/studys/courseList/index',
        query = `?type=2&courceType=${courceType}`
      uni.navigateTo({ url: path + query })
    },
    // 点击推荐课程
    onClickRecommend(id) {
      uni.navigateTo({ url: `/pages/studys/courseDetail/index?course_id=${id}` })
    },
    // 点击政策栏
    onClickPolicy(id) {
      uni.navigateTo({ url: `/pages/studys/policyDetails/index?article_id=${id}` })
    },
    // 点击资料
    onClickLibrary(id) {
      uni.navigateTo({ url: `/pages/studys/libraryDetails/index?library_id=${id}` })
    },
    // 图片预览
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    // 加载成功
    onbindload(e) {
      setTimeout(() => {
        this.isHidden = true
      }, 5000)
    },
    // 记载失败
    onbinderror(e) {
      this.isHidden = true
    },
    async banner() {
      let res = await banner()
      if (res.code === 0) {
        this.swipers = res.data
      }
    },
    async courseList() {
      let region_id = this.currLocation.id
      let category_id = 0
      let price_type = -1
      let recommend = 1
      let page = 1
      let page_size = 2
      let param = { region_id, category_id, price_type, recommend, page, page_size }

      let res = await courseList(param)
      if (res.code === 0) {
        this.courses = res.data.data
      }
    },
    async articleList() {
      let region_id = this.currLocation.id
      let category_id = 0
      let is_recommend = 1
      let page = 1
      let pageSize = 10
      let param = { region_id, category_id, is_recommend, page, pageSize }

      let res = await articleList(param)
      if (res.code === 0) {
        this.policys = res.data.list
      }
    },
    async libraryList() {
      let region_id = this.currLocation.id
      let is_recommend = 1
      let page = 1
      let pageSize = 10
      let param = { is_recommend, page, pageSize }
      let res = await libraryList(param)
      if (res.code === 0) {
        this.librarys = res.data.list
      }
    },
    async getSystemRegion() {
      let res = await systemRegion()
      if (res.code === 0) {
        let regions = res.data.map(item => { item.checked = false; return item; })
        this.regions = regions
        if (this.$store.getters.region.id) {
          this.currLocation = this.$store.getters.region
        } else {
          let currLocation = regions[0]
          this.currLocation = currLocation
          this.$store.commit('SET_REGION', currLocation)
        }
      }
    }
  }, // methods end
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$padding-tb: 16rpx;
$padding-lr: 30rpx;

.index {
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
}

.filter {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: $padding-tb $padding-lr;
  font-size: $font-size-base;
  line-height: 56rpx;
  color: $text-color;

  &-left {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  &-right {
    flex: 1;
    text-align: right;
  }

  .icon-location {
    margin: 0 4rpx;
    width: 28rpx;
    height: 28rpx;
  }
}

.swiper-bar {
  padding: 0 $padding-lr;

  .swiper {
    height: 240rpx; // 同时控制着轮播图
    width: calc(750rpx - (2 * $padding-lr));
  }

  .swiper-image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
}

.business-bar {
  margin-top: 20rpx;

  .business {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;
    height: 184rpx;
    margin: 16rpx 0;
    padding: 0 $padding-lr;
    font-size: $font-size-base;
    color: $text-color-inverse;

    &-text {
      display: inline-block;
      margin: 40rpx 40rpx 0 20rpx;
    }

    .block {
      height: 100%;
      flex: 1;
      border-radius: 12rpx;
    }

    .one {
      background-image: url("/static/img/index_bg_business1.png");
      background-size: 100% 100%;
    }

    .two {
      margin-left: 25rpx;
      background-image: url("/static/img/index_bg_business2.png");
      background-size: 100% 100%;
    }

    .three {
      margin-left: 25rpx;
      background-image: url("/static/img/index_bg_business3.png");
      background-size: 100% 100%;
    }
  }
}

.business-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;

  &-left {
    font-size: $font-size-md;
    color: $text-color;
  }

  &-right {
    font-size: $font-size-base;
    color: $text-color-grey;
  }
}

.course-bar {
  padding: 24rpx 0;
  border-top: $logan-border-spacing-md;

  .logan-card-body-left {
    position: relative;

    .cover-tag {
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
  }

  .logan-card-right-center {
    font-size: $font-size-sm;
  }

  .logan-card-right-footer {
    align-items: baseline;
    font-size: $font-size-sm;
  }

  .audience {
    font-size: $font-size-sm;
    color: $color-primary;
    .icon-person {
      margin-right: 8rpx;
      background-color: #dfecff;
      border-radius: 50%;
    }
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

.policy-bar {
  padding: 24rpx 0;
  border-top: $logan-border-spacing-md;
}

.policy-swiper {
  padding: 0 $padding-lr;
  border: $logan-border-spacing-md-sm;

  .swiper {
    padding: 16rpx 0rpx;
    height: 200rpx;
  }

  .swiper-item-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: nowrap;
    width: $img-size-width-sm;
    height: 100%;
    color: $text-color-title;

    .swiper-image {
      width: 200rpx;
      height: 120rpx;
      border-radius: 12rpx;
    }

    .swiper-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-top: 16rpx;
      font-size: $font-size-sm;
    }
  }
}

.library-bar {
  padding: 24rpx 0;
  border-top: $logan-border-spacing-md;
  .library-text {
    margin-left: 8rpx;
  }

  .card-body-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex: 3 1 0;
    height: 100%;
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

  .card-right-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: $font-size-sm;
    color: $text-color-grey;
  }
}

.org-list {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  z-index: 999;

  &-title {
    width: 100%;
    height: 84rpx;
    text-align: center;
    line-height: 84rpx;
    font-size: $font-size-base;
    color: $color-primary;
    border: 2rpx solid #eee;
  }

  &-item {
    width: 100%;
    height: 84rpx;
    text-align: center;
    line-height: 84rpx;
    font-size: $font-size-base;
    border: 2rpx solid #eee;
  }
}
</style>
