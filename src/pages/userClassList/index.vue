<template>
  <view class="user-class-list">
    <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp">
      <u-section v-for="item in classList" :key="item.id"  :title="item.join" type="line" class="section">
        <CardRow :leftImage="item.thumb" :rightTop="item.title"
                 :rightFooter="item.time" @clickRight="onClickCource" @previewImg="previewImg">
          <template v-slot:rightCenter>
            <view class="logan-card-right-center">
              <text>班级人数：60人</text>
              <text>视频数量：16</text>
            </view>
          </template>
          <template v-slot:rightFooter>
            <view class="logan-card-right-footer">
              班主任： 朱老师
            </view>
          </template>
        </CardRow>
      </u-section>
    </mescroll-body>
  </view>
</template>

<script>
import uSection from "@/components/uSection/index"
import CardRow from "@/components/card-row/index";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  components: { CardRow, uSection },
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      classList: [
        { 
          id: 1, name: "name1", money: 0, oldMoney: 0, thumb: '/static/img/index_cource1.png', 
          title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", progress: "30", 
          join: '2022年4月20日 16:30:30 加入班级'
        },
        { 
          id: 2, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_cource2.png", 
          title: "特种作业低压电工实操课", time: "12章24课时", progress: "30",
          join: '2022年4月20日 16:30:30 加入班级' 
        }
      ]
    }
  },
  methods: {
    // 下拉
    onDown() {
      this.mescroll.endBySize(1, 1)
    },
    // 上拉
    onUp() {
      this.mescroll.endBySize(1, 1)
    },
    // 班级详情
    onClickCource() {

    },
    // 图片预览
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.user-class-list {
  padding: 0 30rpx;
  width: calc(750rpx - 60rpx);
}

.section {
  margin-top: 40rpx;
  border: $logan-border-spacing-md-sm
}

</style>