<template>
  <view class="index">
    <!-- #ifdef MP-WEIXIN -->
    <official-account @load="onbindload" @error="onbinderror" :hidden="isHidden"></official-account>
    <!-- #endif -->

    <view class="filter">
      <view class="filter-left" @click="onOpenFilter">
        <uni-icons type="location" size="36rpx" color="#199fff" />
        <text class="location">{{ currLocation.region }}</text>
        <uni-icons type="bottom" size="32rpx" />
      </view>
      <view class="filter-right">
        <uni-icons type="search" size="40rpx" @click="onOpenSearch" />
      </view>
    </view>

    <view class="swiper-bar">
      <swiper :interval="2000" autoplay circular disable-touch class="swiper">
        <swiper-item v-for="swiper in swipers" :key="swiper.id" @click="() => onClickSwiperImg(swiper)" :current-item-id="swiper.id"
                     class="swiper-item">
          <image @click="() => previewImg(swiper.thumb)" :src="swiper.banner" class="swiper-image" mode="scaleToFill" />
        </swiper-item>
      </swiper>
    </view>

    <view class="business-bar">
      <view class="logan-list-head">
        <view class="logan-list-head-left">安全生产资格培训</view>
        <view class="logan-list-head-right" @click="() => onClickAll(1)">
          <text>查看全部</text>
          <uni-icons type="forward" size="28rpx" />
        </view>
      </view>
      <view class="business">
        <view v-for="business in businesses" :key="business.id" @click="() => onClickCource(business.id)"
              :class="'block ' + business.type">
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
        <CardRow v-for="course in courses" :key="course.id">
          <template v-slot:cardBodyLeft>
            <view class="logan-card-body-left">
              <image @click="() => previewImg(course.thumb)" :src="course.thumb" class="logan-img-size-lg"
                     mode="aspectFit" />
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="logan-card-body-right" @click="() => onClickRecommend(course.id)">
              <view class="logan-card-right-top">
                <text>{{ course.title }}</text>
              </view>
              <view class="logan-card-right-center">{{ course.time }}</view>
              <view class="logan-card-right-footer">
                <view class="audience">
                  <uni-icons type="person-filled" color="#fff" class="icon-person" size="24rpx"></uni-icons>
                  <text style="margin-left: 10rpx">{{ course.num }}人看过</text>
                </view>
                <view class="cost">
                  <view v-if="course.money > 0">
                    <text class="present-price">￥{{ course.money }}</text>
                    <text class="original-price">{{ course.oldMoney }}</text>
                  </view>
                  <uni-tag v-else class="tag" type="warning" size="small" text="免费" inverted />
                </view>
              </view>
            </view>
          </template>
        </CardRow>
      </view>
    </view>

    <view class="policy-bar">
      <view class="logan-list-head">
        <view class="logan-list-head-left">政策专栏</view>
        <view class="logan-list-head-right" @click="() => onClickAll(3)">
          <text>查看全部</text>
          <uni-icons type="forward" size="28rpx" />
        </view>
      </view>

      <view class="policy-swiper">
        <swiper @change="onChangeSwiper" :display-multiple-items="3" :autoplay="false" circular class="swiper">
          <swiper-item v-for="policy in policys" :key="policy.id" :current-item-id="policy.id">
            <view class="swiper-item-box" @click="() => onClickPolicy()">
              <image :src="policy.cover" class="swiper-image" mode="scaleToFill" />
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
          <text>查看全部</text>
          <uni-icons type="forward" size="28rpx" />
        </view>
      </view>

      <view class="library-list">
        <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.cover" :rightFooter="library.time || '--'"
                 @clickRight="() => onClickLibrary()" @previewImg="previewImg">
          <template v-slot:rightTop>
            <view class="logan-card-right-top">
              <uni-icons custom-prefix="iconfont" type="icon-file-pdf-fill" size="28rpx" color="#dd524d" />
              <text class="library-text">{{ library.title }}</text>
            </view>
          </template>
        </CardRow>
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
import RegionChange from './components/RegionChange'
import { mapGetters } from 'vuex'
import {
  systemRegion,
  banner,
  articleList,
  libraryList
} from  '@/api/index'


export default {
  components: {
    CardRow,
    RegionChange
  },
  data() {
    return {
      isHidden: false,
      showRegionChange: false,
      // 地区数据
      currLocation: {},
      regions: [],
      // 文库资料
      librarys: [
        { id: 1, name: "name1", thumb: "/static/img/index_library1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "2022-03-18 18:30" },
        { id: 2, name: "name1", thumb: "/static/img/index_library1.png", title: "建筑设计防火规范标准", time: "2022-03-18 18:30" },
      ],
      // 政策专栏
      policys: [
        { id: 1, cover: "/static/img/index_policy1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
        { id: 2, cover: "/static/img/index_policy1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
        { id: 3, cover: "/static/img/index_policy1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
      ],
      // 推荐课程
      courses: [
        { id: 26, name: "name1", money: 0, oldMoney: 0, thumb: '/static/img/index_cource1.png', title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 27, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_cource1.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
      ],
      // 业务板块
      businesses: [
        { id: 1, type: "one", title: "特种作业上岗正", url: "" },
        { id: 2, type: "two", title: "两类人员安全正", url: "" },
        { id: 3, type: "three", title: "其他从业人员", url: "" },
      ],
      // 轮播
      swipers: [
        { id: 26, thumb: 'https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/index_swiper.png', url: "" },
        { id: 27, thumb: 'https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/index_swiper.png', url: "" }
      ],
    };
  },
  onLoad() {
    this.banner()
    this.getSystemRegion()
  },
  computed: {
    ...mapGetters(['organizationList'])
  },
  onReady() {
    let orgInfo = uni.getStorageSync('orgInfo')
    let userInfo = uni.getStorageSync('userInfo')
    if (userInfo.token) {
      if (!orgInfo.id) this.openPopup(this.organizationList);
    }
  },
  onShow() {
    if (this.$refs['popup-org']) {
      let orgInfo = uni.getStorageSync('orgInfo')
      let userInfo = uni.getStorageSync('userInfo')
      if (userInfo.token) {
        if (!orgInfo.id) {
          this.openPopup(this.organizationList);
        }
      }
    }
  },
  methods: {
    init() {
      this.articleList()
      this.libraryList()
    },
    openPopup(list) {
      if (list && list.length) {
        let len = list.length
        if (len > 1) {
          uni.hideTabBar()
          this.$refs['popup-org'].open('bottom')
        } else {
          this.$store.dispatch('setOrgCurrent', list[len - 1])
        }
      }
    },
    // 选择机构
    onChoiceOrg(item) {
      uni.showToast({ title: `欢迎进入${item.name}`, icon: 'none'})
      this.$store.dispatch('setOrgCurrent', item)
      this.$refs['popup-org'].close()
      uni.showTabBar()
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
      let url = '/pages/studys/courseDetail/index'
      let query = `?course_id=${swiper.url}`
      uni.navigateTo({ url: url + query })
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
    onClickPolicy() {
      uni.navigateTo({ url: '/pages/studys/policyDetails/index' })
    },
    // 点击资料
    onClickLibrary() {
      uni.navigateTo({ url: '/pages/studys/libraryDetails/index' })
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
    // 数据获取
    getData() {
    },

    reloadData() {
    },
    async banner() {
      let res = await banner()
      if (res.code === 0) {
        this.swipers = res.data
      }
    },
    async articleList() {
      console.log('region_id',this.currLocation);
      let region_id = this.currLocation.id
      let category_id = 0
      let is_recommend = 0
      let page = 1
      let pageSize = 3
      let param = {region_id, is_recommend, page, pageSize}
      let res = await articleList(param)
      if (res.code === 0) {
        this.policys = res.data.total ? res.data.list : this.policys
      }
    },
    async libraryList() {
      let region_id = this.currLocation.id
      let is_recommend = 1
      let page = 1
      let pageSize = 3
      let param = { region_id, is_recommend, page, pageSize}
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
      this.init()
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
  padding: $padding-tb 0;
}

.filter {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: $padding-tb $padding-lr;
  font-size: $font-size-base;
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

  .present-price {
    font-size: $font-size-md;
    color: $color-warning;
  }

  .original-price {
    margin-left: 8rpx;
    font-size: $font-size-sm;
    text-decoration: line-through #999;
  }

  .tag {
    position: relative;
    bottom: 8rpx;
    font-size: 24rpx;
    font-weight: 700;
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
}

.org-list {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  // padding-bottom: var(--window-bottom);
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
