<template>
  <view class="content">
    <view class="filter">
      <view class="filter-left" @click="onOpenFilter">
        <uni-icons type="location" size="32rpx" color="#007aff" />
        <text class="location">广东地区</text>
        <uni-icons type="forward" size="32rpx" />
      </view>
      <view class="filter-right">
        <uni-icons type="search" size="48rpx" @click="onOpenSearch" />
      </view>
    </view>

    <view class="swiper">
      <swiper @change="onChangeSwiper" :interval="2000" autoplay circular disable-touch>
        <swiper-item v-for="swiper in swipers" :key="swiper.id" :current-item-id="swiper.id">
          <image :src="swiper.thumb" class="swiper-image" mode="aspectFit" />
        </swiper-item>
      </swiper>
    </view>

    <view class="business-bar">
      <view class="business-head">
        <view class="business-head-left">安全生产</view>
        <view class="business-head-right">
          <text>全部</text>
          <uni-icons type="forward" size="32rpx" />
        </view>
      </view>
      <view class="business">
        <view v-for="business in businesses" :key="business.id" :class="'block ' + business.type">
          {{ business.title }}
        </view>
      </view>
    </view>

    <view class="course-bar">
      <view class="logan-list-head">
        <view class="logan-list-head-left">推荐课程</view>
        <view class="logan-list-head-right">
          <text>全部</text>
          <uni-icons type="forward" size="32rpx" />
        </view>
      </view>

      <view class="courses-list">
        <CardRow v-for="course in courses" :key="course.id">
          <template v-slot:cardBodyLeft>
            <view class="logan-card-body-left">
              <image class="logan-img-size-lg" :src="course.thumb" mode="aspectFit" />
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="logan-card-body-right">
              <view class="logan-card-right-top">
                <text>{{ course.title }}</text>
              </view>
              <view class="logan-card-right-center">{{ course.time }}</view>
              <view class="logan-card-right-footer">
                <view class="audience">{{ course.num }}人看过</view>
                <view class="cost">
                  <view v-if="course.money > 0">
                    <text class="present-price">￥{{ course.money }}</text>
                    <text class="original-price">{{ course.oldMoney }}</text>
                  </view>
                  <uni-tag v-else custom-style="position: relative; bottom: 4rpx; font-size: 12rpx;" type="warning"
                           text="免费" inverted />
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
        <view class="logan-list-head-right">
          <text>全部</text>
          <uni-icons type="forward" size="32rpx" />
        </view>
      </view>

      <view class="policy-swiper">
        <swiper @change="onChangeSwiper" :display-multiple-items="3" :autoplay="false" circular>
          <swiper-item v-for="policy in policys" :key="policy.id" :current-item-id="policy.id">
            <view class="swiper-item-box">
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
        <view class="logan-list-head-right">
          <text>全部</text>
          <uni-icons type="forward" size="32rpx" />
        </view>
      </view>

      <view class="library-list">
        <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.thumb" :rightFooter="library.time">
          <template v-slot:rightTop>
            <view class="logan-card-right-top">
              <uni-icons type="wallet" size="32rpx" color="#dd524d" />
              <text class="library-text">{{ library.title }}</text>
            </view>
          </template>
        </CardRow>
      </view>
    </view>

    <uni-popup ref="popup" mask-background-color="#fff">
      <RegionChange @change="onChangeRegion" @close="onCloseFilter" :location="location" :buttons="regions" />
    </uni-popup>

  </view>
</template>

<script>
import moment from "@/utils/date";
import { login, list } from "@/api/user";
import CardRow from "@/components/card-row/index";
import RegionChange from './components/RegionChange'

export default {
  components: {
    CardRow,
    RegionChange
  },
  data() {
    return {
      showRegionChange: false,
      // 当前地理位置信息
      location: {
        address: '陕西'
      },
      // 地区数据
      regions: [
        { id: 1, title: '关东关东关东关东', checked: false },
        { id: 2, title: '关西', checked: false },
        { id: 3, title: '山西', checked: false },
        { id: 4, title: '赵家域', checked: false },
        { id: 5, title: '368旅', checked: false },
        { id: 6, title: '太原', checked: false },
        { id: 7, title: '平安县', checked: false },
        { id: 11, title: '关东关东关东关东', checked: false },
        { id: 22, title: '关西', checked: false },
        { id: 33, title: '山西', checked: false },
        { id: 44, title: '赵家域', checked: false },
        { id: 55, title: '368旅', checked: false },
        { id: 66, title: '太原', checked: false },
        { id: 77, title: '平安县', checked: false },
        { id: 111, title: '关东关东关东关东', checked: false },
        { id: 222, title: '关西', checked: false },
        { id: 333, title: '山西', checked: false },
        { id: 444, title: '赵家域', checked: false },
        { id: 555, title: '368旅', checked: false },
        { id: 666, title: '太原', checked: false },
        { id: 777, title: '平安县', checked: false },
        { id: 1111, title: '关东关东关东关东', checked: false },
        { id: 2222, title: '关西', checked: false },
        { id: 3333, title: '山西', checked: false },
        { id: 4444, title: '赵家域', checked: false },
        { id: 5666, title: '368旅', checked: false },
        { id: 6666, title: '太原', checked: false },
        { id: 7777, title: '平安县', checked: false },
        { id: 8, title: '平安县', checked: false },
        { id: 88, title: '平安县', checked: false },
        { id: 888, title: '平安县', checked: false },
        { id: 8888, title: '平安县', checked: false },
      ],
      // 文库资料
      librarys: [
        { id: 1, name: "name1", thumb: "../../static/logo.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "2022-03-18 18:30" },
        { id: 2, name: "name1", thumb: "../../static/logo.png", title: "建筑设计防火规范标准", time: "2022-03-18 18:30" },
      ],
      // 政策专栏
      policys: [
        { id: 1, thumb: "../../static/logo.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
        { id: 2, thumb: "../../static/logo.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
        { id: 3, thumb: "../../static/logo.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准" },
      ],
      // 推荐课程
      courses: [
        { id: 1, name: "name1", money: 0, oldMoney: 0, thumb: "../../static/logo.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 2, name: "name2", money: 998, oldMoney: 1998, thumb: "../../static/logo.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
      ],
      // 业务板块
      businesses: [
        { id: 1, type: "one", title: "特种作业上岗正", url: "" },
        { id: 2, type: "two", title: "两类人员安全正", url: "" },
        { id: 3, type: "three", title: "其他从业人员", url: "" },
      ],
      // 轮播
      swipers: [
        { id: 1, thumb: "../../static/logo.png", url: "" },
        { id: 2, thumb: "../../static/logo.png", url: "" },
        { id: 3, thumb: "../../static/logo.png", url: "" },
      ],
    };
  },
  created() {
    console.log("加载了", moment({}).format());
  },
  methods: {
    // 打开搜索页面
    onOpenSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    // 地区选择
    onChangeRegion({ index, checked }) {
      console.log('onChangeRegion', index, checked);
      const list = this.regions
      const pre = list.findIndex(item => item.checked);
      if (pre !== -1) { this.regions[pre].checked = false }
      this.regions[index].checked = checked
    },
    // 点击筛选
    onOpenFilter() {
      console.log(this.$refs.popup);
      this.$refs.popup.open('top')
    },
    onCloseFilter() {
      this.$refs.popup.close()
    },
    onChangeSwiper({ detail }) {
      // console.log("onChangeSwiper", detail);
    },
    sliderChange() { },
    goTo() {
      uni.navigateTo({
        url: "/pages/test/index",
      });
    },
  },
  onReachBottom() {
    console.log("到底了");
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$padding-tb: 16rpx;
$padding-lr: 20rpx;

.content {
  overflow: hidden;
}

.filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: $padding-tb $padding-lr;
  font-size: $font-size-md;
  color: $text-color;

  &-left {
    flex: 1;
    justify-content: space-around;
  }

  &-right {
    flex: 1;
    text-align: right;
    height: 24rpx;
    line-height: 24rpx;
  }

  .location {
    margin: 0 4rpx;
  }
}

.swiper {
  margin: 16rpx 0;
  background: gold;

  &-image {
    width: 100%;
    height: 100%;
  }
}

.business-bar {
  padding: $padding-tb $padding-lr;

  .business {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;
    height: 200rpx;
    margin: 8rpx 0;
    font-size: $font-size-md;
    line-height: 200rpx;
    text-align: center;
    color: $text-color-inverse;

    .block {
      height: 100%;
      flex: 1;
      border-radius: 24rpx;
    }

    .one {
      background-color: $color-primary;
    }

    .two {
      margin-left: 24rpx;
      background-color: $color-warning;
    }

    .three {
      margin-left: 24rpx;
      background-color: $color-success;
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
  border-top: $logan-border-spacing;

  .logan-card-right-center {
    margin-top: 8rpx;
  }

  .logan-card-right-footer {
    align-items: baseline;
    font-size: $font-size-base;
  }

  .audience {
    color: $color-primary;
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
}

.policy-bar {
  padding: 24rpx 0;
  border-top: $logan-border-spacing;
}

.policy-swiper {
  padding: $padding-tb $padding-lr;

  .swiper-item-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: nowrap;
    width: $img-size-width-sm;
    height: 100%;

    .swiper-image {
      width: $img-size-width-sm;
      height: $img-size-height-sm;
    }

    .swiper-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-top: 24rpx;
      font-size: $font-size-base;
    }
  }
}

.library-bar {
  padding: 24rpx 0;
  border-top: $logan-border-spacing;
  .library-text {
    margin-left: 8rpx;
  }
}
</style>
