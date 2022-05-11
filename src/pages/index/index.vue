<template>
  <view class="index">
    <!-- #ifdef MP-WEIXIN -->
    <official-account @load="onbindload" @error="onbinderror" :hidden="isHidden"></official-account>
    <!-- #endif -->
  
    <view class="filter">
      <view class="filter-left" @click="onOpenFilter">
        <uni-icons type="location" size="36rpx" color="#199fff" />
        <text class="location">广东地区</text>
        <uni-icons type="bottom" size="32rpx" />
      </view>
      <view class="filter-right">
        <uni-icons type="search" size="40rpx" @click="onOpenSearch" />
      </view>
    </view>

    <view class="swiper-bar">
      <swiper :interval="2000" autoplay circular disable-touch class="swiper">
        <swiper-item v-for="swiper in swipers" :key="swiper.id" @click="onClickSwiperImg" :current-item-id="swiper.id" class="swiper-item">
          <image @click="() => previewImg(swiper.thumb)" :src="swiper.thumb" class="swiper-image" mode="aspectFit" />
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
              <image :src="policy.thumb" class="swiper-image" mode="aspectFit" />
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
        <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.thumb" :rightFooter="library.time"
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
      <RegionChange @change="onChangeRegion" @close="onCloseFilter" :location="location" :buttons="regions" />
    </uni-popup>
  </view>
</template>

<script>
import moment from "@/utils/date";
import CardRow from "@/components/card-row/index";
import RegionChange from './components/RegionChange'

export default {
  components: {
    CardRow,
    RegionChange
  },
  data() {
    return {
      isHidden: false,
      showRegionChange: false,
      // 当前地理位置信息
      location: {
        address: '安全生产网络培训平台'
      },
      // 地区数据
      regions: [
        { id: 1, title: '关东关东', checked: false },
        { id: 2, title: '关西', checked: false },
        { id: 3, title: '山西', checked: false },
        { id: 4, title: '赵家域', checked: false },
        { id: 5, title: '368旅', checked: false },
        { id: 6, title: '太原', checked: false },
        { id: 7, title: '平安县', checked: false },
      ],
      // 文库资料
      librarys: [
        { id: 1, name: "name1", thumb: "/static/img/index_library1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "2022-03-18 18:30" },
        { id: 2, name: "name1", thumb: "/static/img/index_library2.png", title: "建筑设计防火规范标准", time: "2022-03-18 18:30" },
      ],
      // 政策专栏
      policys: [
        { id: 1, thumb: "/static/img/index_policy1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
        { id: 2, thumb: "/static/img/index_policy2.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
        { id: 3, thumb: "/static/img/index_policy3.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
      ],
      // 推荐课程
      courses: [
        { id: 1, name: "name1", money: 0, oldMoney: 0, thumb: '/static/img/index_cource1.png', title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 2, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_cource2.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
      ],
      // 业务板块
      businesses: [
        { id: 1, type: "one", title: "特种作业上岗正", url: "" },
        { id: 2, type: "two", title: "两类人员安全正", url: "" },
        { id: 3, type: "three", title: "其他从业人员", url: "" },
      ],
      // 轮播
      swipers: [
        { id: 1, thumb: 'https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/index_swiper.png', url: "" },
        { id: 2, thumb: 'https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/index_swiper.png', url: "" }
      ],
    };
  },
  created() {
    console.log("加载了", moment({}).format());
  },
  methods: {
    // 点击筛选
    onOpenFilter() {
      console.log(this.$refs.popup);
      this.$refs.popup.open('top')
    },
    // 关闭筛选
    onCloseFilter() {
      this.$refs.popup.close()
    },
    // 地区选择
    onChangeRegion({ index, checked }) {
      console.log('onChangeRegion', index, checked);
      const list = this.regions
      const pre = list.findIndex(item => item.checked);
      if (pre !== -1) { this.regions[pre].checked = false }
      this.regions[index].checked = checked
    },
    // 打开搜索页面
    onOpenSearch() {
      uni.navigateTo({ url: '/pages/indexs/search/index' })
    },
    // 轮播图点击事件
    onClickSwiperImg() {
      uni.navigateTo({ url: '/pages/studys/courseDetail/index'} )
    },
    // 查看全部
    onClickAll(type) {
      console.log('onClickAll');
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

      uni.navigateTo({ url: path + query})
    },
    // 点击推荐课程
    onClickRecommend() {
      uni.navigateTo({ url: '/pages/studys/courseDetail/index' })
    },
    // 点击政策栏
    onClickPolicy() {
      uni.navigateTo({ url: '/pages/studys/policyDetails/index' })
    },
    // 点击资料
    onClickLibrary() {
      uni.navigateTo({ url: '/pages/studys/libraryDetails/index' })
    },
    // 数据获取
    getData() {
    },
    // 图片预览
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    onbindload(e) {
      setTimeout(() => {
        this.isHidden = true
      }, 5000)
    },
    onbinderror(e) {
      this.isHidden = true
    }
  }, // methods end
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$padding-tb: 16rpx;
$padding-lr: 30rpx;

.index {
  height:  100%;
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
    font-weight: normal;
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
</style>
