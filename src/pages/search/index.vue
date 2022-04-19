<template>
  <view class="search">
    <uni-search-bar :radius="100" @confirm="search"></uni-search-bar>
    <view class="history" v-if="showRecond">
      <view class="head">
        <view class="title">搜索历史</view>
        <uni-c<icon type="trash-filled" size="32rpx" color="#999" @click="onClearHistry" />
      </view>
      <view class="history-list">
        <button @click="onCLickHistory('his', index)" v-for="(history,index) in historys" :key="index" class="btn"
                :class="history.checked ? 'active': 'default'">
          {{ history.name}}
        </button>
      </view>
    </view>
    <view class="hot" v-if="showRecond">
      <view class="head">
        <view class="title">热门搜索</view>
      </view>
      <view class="hot-list">
        <button @click="onCLickHot('hot', index)" v-for="(hot, index) in hots" :key="index" class="btn"
                :class="hot.checked ? 'active': 'default'">
          <uni-icons type="trash" size="32rpx" />
          {{ hot.name}}
        </button>
      </view>
    </view>

    <view class="cources-list">
      <CardRow v-for="course in cources" :key="course.id">
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
</template>

<script>
import CardRow from "@/components/card-row/index";

export default {
  components: {
    CardRow
  },
  data() {
    return {
      showRecond: true,

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
        { id: 1, name: "name1", money: 0, oldMoney: 0, thumb: "../../static/logo.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 2, name: "name2", money: 998, oldMoney: 1998, thumb: "../../static/logo.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
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
        { id: 1, name: "name1", money: 0, oldMoney: 0, thumb: "../../static/logo.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 2, name: "name2", money: 998, oldMoney: 1998, thumb: "../../static/logo.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
      ]
      this.showRecond = false
    },
    // 点击课程
    onCourse() {

    },
    // 搜索
    onSearch() {

    },
    // 搜索廓输入
    onInputSearch() {

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
  margin-left: 0rpx;
  margin-right: 0rpx;
  font-size: $font-size-base;
  border-width: 2rpx;
  border-style: solid;
  background-color: #f8f8f8;
}

.active {
  color: #007aff;
  border-color: #007aff;
}

.default {
  color: #777;
  border-color: #f8f8f8;
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
</style>