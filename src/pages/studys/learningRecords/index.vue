<template>
  <view class="learning-records">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="main">
      <view class="title">学习记录表</view>

      <view class="table">
        <view class="row">
          <view class="col type-1">学习者姓名</view>
          <view class="col type-2">{{ tableData.name }}</view>
        </view>
        <view class="row">
          <view class="col type-1">身份证号码</view>
          <view class="col type-2">{{ tableData.id_card }}</view>
        </view>
        <view class="row">
          <view class="col type-1">学习者编号</view>
          <view class="col type-2">{{ tableData.stunum }}</view>
        </view>
        <view class="row">
          <view class="col type-1">申请培训类别</view>
          <view class="col type-2">{{ tableData.busitype }}</view>
        </view>
        <view class="row">
          <view class="col type-1">申请培训类型</view>
          <view class="col type-2">{{ tableData.apcategory }}</view>
        </view>

        <view class="row">
          <view class="col type-3">规定培训学时</view>
          <view class="col type-4">{{ tableData.total_hour }}</view>

          <view class="col type-3">累计完成学时</view>
          <view class="col type-4">{{ tableData.completed_hour }}</view>
        </view>
        <view class="row">
          <view class="col type-3">学习开始时间</view>
          <view class="col type-4">{{ tableData.start_date }}</view>

          <view class="col type-3">学习结束时间</view>
          <view class="col type-4">{{ tableData.end_date }}</view>
        </view>

        <view class="row">
          <view class="col type-3">课程名称</view>
          <view class="col type-4">{{ listData.course_title }}</view>

          <view class="col type-3">课程编号</view>
          <view class="col type-4">{{ listData.course_id }}</view>
        </view>

        <view class="row">
          <view class="col type-5">单次学习开始时间</view>
          <view class="col type-5">单次学习结束时间</view>
          <view class="col type-5">IP地址</view>
        </view>
        <view v-for="(item, index) in listData.data" :key="index">
          <view class="row">
            <view class="col type-6">{{ item.starttime }}</view>
            <view class="col type-6">{{ item.endtime }}</view>
            <view class="col type-6">{{ item.ip }}</view>
          </view>
        </view>
      </view>

      <view class="seal" v-if="tableData.certificate_stamp">
        <view class="text">{{ tableData.org_name }}</view>
        <view class="text">{{ tableData.today }}</view>
        <image class="seal-img" :src="tableData.certificate_stamp" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import { buildLearnRecord } from '@/api/course'

export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '学习记录',
      course_id: '',
      tableData: {},
      listData: {}
    }
  },
  onLoad(options) {
    let { course_id } = options
    this.course_id = course_id
    this.buildLearnRecord()
  },
  methods: {
    async buildLearnRecord() {
      uni.showLoading({ title: '记录生成中' })
      let params = { course_id: this.course_id }
      let res = await buildLearnRecord(params)
      if (res.code === 0) {
        let listData = {}
        listData.course_title = res.data.record.data[0].course_title
        listData.course_id = res.data.record.data[0].course_id
        listData.data = res.data.record.data.map(item => ({starttime: item.starttime, endtime: item.endtime, ip: item.ip}))

        this.tableData = res.data
        this.listData = listData
      }
      uni.hideLoading()
    }
  }
}
</script>

<style lang="scss" scoped>
.learning-records {
  width: 100%;
  padding-bottom: var(--window-bottom);
}

.main {
  position: relative;
  padding: 30rpx 20rpx;
}

.title {
  width: 100%;
  font-size: 32rpx;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
}

.table {
  display: flex;
  flex-flow: column nowrap;
  border-bottom: 1px solid #666;
}

.row {
  display: flex;
  flex-direction: row;
  min-height: 60rpx;
  font-size: 24rpx;
  line-height: 60rpx;
  border-collapse: collapse;
  border: 1px solid #666;
  border-bottom: none;
}

.col {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  border-right: 1px solid #666;;
}

.col:last-child {
  border-right: none;
}

.type-1 {
  flex: 1;
}

.type-2 {
  flex: 3;
}

.type-3 {
  flex: 1;
}

.type-4 {
  flex: 1;
}

.type-5 {
  flex: 1.5;
}

.type-5:nth-of-type(3) {
  flex-grow: 1;
}

.type-6 {
  flex: 1.5;
}

.type-6:nth-of-type(3) {
  flex-grow: 1;
}

.seal {
  position: relative;
  float: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .seal-img {
    position: absolute;
    width: 160rpx;
    height: 160rpx;
  }

  .text {
    font-size: 24rpx;
    color: #666;
  }
}


</style>