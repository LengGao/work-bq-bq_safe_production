<template>
  <view class="course-list">
    <view class="course-list-header">
      <picker class="picker" @change="categoryPickerChange" @columnchange="onColumnchange" range-key="name"
              mode="multiSelector" :value="categoryIndex" :range="categoryData">
        <view class="picker-btn">
          <uni-icons type="bars" size="40rpx"></uni-icons>
          <view>{{categoryName}}</view>
        </view>
      </picker>
      <picker class="picker" @change="categoryPickerChange" @columnchange="onColumnchange" range-key="name"
              mode="multiSelector" :value="categoryIndex" :range="categoryData">
        <view class="picker-btn">
          <uni-icons type="bars" size="40rpx"></uni-icons>
          <view>{{categoryName}}</view>
        </view>
      </picker>
    </view>
    <scroll-view class="course-list-container">
      <view class="course-item">
        课程
      </view>
    </scroll-view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      categoryName: '全部分类',
      categoryId: 0,
      categoryIndex: [],
      categoryData: [
        [{ name: '全部', id: 0 }, { name: '安监类', id: 2 }]
        ,
        [{ name: '全部', id: 3 }]
      ],
      colunmMap: {
        0: [{ name: '全部', id: 0 }],
        1: [{ name: '测试', id: 4 }],
      }
    };
  },
  methods: {
    onColumnchange({ detail }) {
      console.log(detail)
      if (detail.column === 0) {
        console.log(this.colunmMap[detail.value])
        this.categoryData[1] = this.colunmMap[detail.value]
      }
    },
    categoryPickerChange({ detail }) {
      console.log(detail)
      this.categoryIndex = detail.value;
      const [a, b] = detail.value
      this.categoryName = this.categoryData[1][b].name
      this.categoryId = this.categoryData[b].id

    },

  },
};
</script>

<style lang="scss" scoped>
.course-list {
  &-header {
    display: flex;
    align-items: center;
    .picker {
      flex: 1;
      &-btn {
        padding: 20rpx 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>