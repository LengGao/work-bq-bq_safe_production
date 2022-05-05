<template>
  <view class="detail">
    <view class="card">
      <view class="title">
        新《安全生产法》宣传片
      </view>
      <view class="subtitle">
        12章24课时  |  共30学时        
      </view>
      <view class="fotter">
        <view class="left">
          <uni-icons customPrefix="iconfont" type="icon-user1" size="28rpx" color="#199fff" />
          <text class="staff">赵老师</text>
        </view>
        <text class="person">500人在学</text>
      </view>
    </view>

    <view class="textarea">
      <u-parse :content="nodes.content || '--'" />
    </view>
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
export default {
  components: {
    uParse
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      nodes: {
        content: `
        <img src="https://img2.baidu.com/it/u=1347252749,346830019&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" />
        <em>
          3月28日，省三防办主任、省应急管理厅党委书记、厅长王中丙主持召开汛期防汛备汛工作情况汇报会，要求用好应急管理改革硬招实招，加强防汛备汛工作。

          　　会议要求，要压实三防工作责任，对乡镇（街道）应急管理体制改革到位没有、省市县镇村五级指挥体系打通没有、“三个联系”制度落到实处没有等情况进行检查督促。

          　　要加强值班值守，加强会商研判，坚持做到研判风险在哪里，指挥调度就到那里，工作检查就到哪里，应急小分队就派到哪里。

          　　要加强防汛备汛宣传工作，积极发掘在防汛备汛过程中涌现的典型人物和案例，以模范带动提升基层三防责任人履职能力。
        </em>`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$title-size: 34rpx;
$subtitle-size: 24rpx;
$text-size: 12rpx;

.card {
  display: flex;
  flex-direction: column;
  padding: 28rpx;
  color: #333;

  .title {
    font-size: $title-size;
    font-weight: bold;
  }

  .subtitle {
    margin-top: 24rpx;
    font-size: $subtitle-size;
  }

  .fotter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 24rpx;
    font-size: $text-size;

    .staff {
      margin-left: 10rpx;
    }
  }
}

.card-type-pane {
  border-top: $logan-border-spacing-md;
}

.pane {
  display: flex;
  flex-direction: column;
  margin-bottom: 32rpx;
  color: #333;

  .pane-title {
    font-size: $title-size;
    font-weight: bold;
    line-height: calc(2 * $title-size);
  }

  .pane-text {
    height: calc(2 * $subtitle-size);
    font-size: $subtitle-size;
    line-height: calc(2 * $subtitle-size);
  }
}

.textarea {
  padding: 30rpx;
}
</style>