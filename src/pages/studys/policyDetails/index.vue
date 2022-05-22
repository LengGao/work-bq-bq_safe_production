<template>
  <view class="policy-details">
    <view class="title">用应急管理改革硬招实招加强防汛备汛工作</view>
    <view class="subtitle">
      <view class="left">
        <text class="school">东培学堂</text>
        <text class="time">2022-18-12 18:30:00</text>
      </view>
      <view class="right">阅读888</view>
    </view>

    <view class="textarea">
      <u-parse :content="nodes.content || '--'" />
    </view>

  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import { getAnnouncementInfo } from "@/api/index";
export default {
  components: {
    uParse
  },
  data() {
    return {
      nodes: {
        content: `
        <img src="https://img2.baidu.com/it/u=1347252749,346830019&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" ></img>
        <em>
          3月28日，省三防办主任、省应急管理厅党委书记、厅长王中丙主持召开汛期防汛备汛工作情况汇报会，要求用好应急管理改革硬招实招，加强防汛备汛工作。

          　　会议要求，要压实三防工作责任，对乡镇（街道）应急管理体制改革到位没有、省市县镇村五级指挥体系打通没有、“三个联系”制度落到实处没有等情况进行检查督促。

          　　要加强值班值守，加强会商研判，坚持做到研判风险在哪里，指挥调度就到那里，工作检查就到哪里，应急小分队就派到哪里。

          　　要加强防汛备汛宣传工作，积极发掘在防汛备汛过程中涌现的典型人物和案例，以模范带动提升基层三防责任人履职能力。
        </em>`
      }
    }
  },
  mounted() {
    this.getData()

  },
  methods: {
    // 获取数据
   async getData() {
      // const res = await getAnnouncementInfo({ id: 717 }) 
      //   if (res.code == 0) {
      //     this.nodes = res.data
      //   }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.policy-details {
  overflow: hidden;
  padding: 30rpx;
}

.title {
  font-size: $font-size-xlg;
}

.subtitle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  font-size: $font-size-sm;

  .school {
    color: $color-primary;
  }

  .time {
    color: $text-color-grey;
  }

  .right {
    color: $text-color;
  }
}

.textarea {
  margin-top: 20rpx;
}
</style>