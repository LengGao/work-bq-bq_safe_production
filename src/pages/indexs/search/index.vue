<template>
  <view class="search">
    <uni-search-bar @confirm="onSearch" v-model="keyword" :radius="24" placeholder="搜索您感兴趣的课程"></uni-search-bar>
    <view class="history" v-if="showRecond">
      <view class="head">
        <view class="title">搜索历史</view>
        <uni-icons type="trash-filled" size="48rpx" color="#999" @click="onClearHistry" />
      </view>
      <view class="history-list">
        <button @click="onCLickHistory('his', index)" v-for="(history,index) in historys" :key="index" class="btn">
          <text>{{ history.name }}</text>
        </button>
      </view>
    </view>
    <view class="hot" v-if="showRecond">
      <view class="head">
        <view class="title">热门搜索</view>
      </view>
      <view class="hot-list">
        <button @click="onCLickHot('hot', index)" v-for="(hot, index) in hots" :key="index" class="btn">
          <text>{{ hot.name }}</text>
        </button>
      </view>
    </view>

    <view class="cources-list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp">
        <CardRow v-for="course in cources" :key="course.id">
          <template v-slot:cardBodyLeft>
            <view class="logan-card-body-left">
              <image class="logan-img-size-lg" :src="course.thumb" @click="() => previewImg(course.thumb)" mode="aspectFit" />
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="logan-card-body-right" @click="() => onCourse(course.id)">
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
                  <uni-tag v-else class="tag" type="warning" text="免费" inverted />
                </view>
              </view>
            </view>
          </template>
        </CardRow>
      </mescroll-body>
    </view>

  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

export default {
  mixins: [MescrollMixin],
  components: {
    CardRow
  },
  data() {
    return {
      showRecond: true,
      keyword: '',

      historys: [
        { id: 1, name: '管理工程师', tag: 'hot', checked: false },
        { id: 2, name: '系统集成项目管理工程师', tag: 'hot', checked: false },
      ],
      hots: [
        { id: 1, name: '系统集管', tag: 'hot', checked: false },
        { id: 2, name: '系统集成项目管理工程师', tag: 'hot', checked: false },
        { id: 3, name: '系统集成项目管理工程师', tag: '', checked: false },
        { id: 4, name: '系统集成项目管理工程师', tag: '', checked: false }
      ],
      cources: [
      ],
    }
  },
  methods: {
    // 点击搜索历史
    onCLickHistory() {
      this.cources = [
        { id: 26, name: "name1", money: 0, oldMoney: 0, thumb: "/static/img/index_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 27, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_cource1.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
      ]
      this.showRecond = false
    },
    // 清空搜索历史
    onClearHistry() {
      this.historys = []
    },
    // 点击热门搜索
    onCLickHot() {
      this.cources = [
        { id: 26, name: "name1", money: 0, oldMoney: 0, thumb: "/static/img/index_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 27, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_cource1.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
      ]
      this.showRecond = false
    },
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    // 点击课程
    onCourse(id) {
      let url = '/pages/studys/courseDetail/index'
      let query = `?course_id=${id}`
      uni.navigateTo({ url: url + query })
    },
    // 搜索
    onSearch(e) {
      console.log(e);
    },
    // 上拉加载
    onUp() {
      this.mescroll.endBySize(1, 1)
    },
    // 下拉刷新
    onDown() {
      this.mescroll.endBySize(1, 1)
    }

  },

}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.search {
  width: 100%;
  overflow: hidden;
}

.history,
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

.history-list,
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
  flex: 1 1 1;
  margin: 8rpx 10rpx;
  font-size: $font-size-base;
  background-color: #fff;
  color: $text-color-default;
}

.course-bar {
  padding: 24rpx 0;
  border-top: $logan-border-spacing-md;

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

  .tag {
    position: relative;
    bottom: 8rpx;
    font-size: 24rpx;
    font-weight: normal;
  }
}

::v-deep .uni-searchbar__box {
  justify-content: flex-start;
} 
</style>