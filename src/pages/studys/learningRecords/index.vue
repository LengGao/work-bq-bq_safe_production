<template>
  <view class="learning-records">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="main">
      <view class="table">
        <view class="row">
          <view class="col">学习者姓名</view>
          <view class="col">{{ tableData.name }}</view>
        </view>
        <view class="row">
          <view class="col">身份证号码</view>
          <view class="col">{{ tableData.id_card }}</view>
        </view>
        <view class="row">
          <view class="col">学习者编号</view>
          <view class="col">{{ tableData.stunum }}</view>
        </view>
        <view class="row">
          <view class="col">申请培训类别</view>
          <view class="col">{{ tableData.busitype }}</view>
        </view>
        <view class="row">
          <view class="col">申请培训类型</view>
          <view class="col">{{ tableData.apcategory }}</view>
        </view>
        <view class="row">
          <view class="col">规定培训学时</view>
          <view class="col">{{ tableData.total_hour }}</view>

          <view class="col">累计完成学时</view>
          <view class="col">{{ tableData.completed_hour }}</view>
        </view>
        <view class="row">
          <view class="col">学习开始时间</view>
          <view class="col">{{ tableData.start_date }}</view>

          <view class="col">学习结束时间</view>
          <view class="col">{{ tableData.end_date }}</view>
        </view>
        <view v-for="(item, index) in listData.data" :key="index">
          <view class="row">
            <view class="col">课程名称</view>
            <view class="col">{{ item.course_title }}</view>

            <view class="col">课程编号</view>
            <view class="col">{{ item.course_id }}</view>
          </view>
          <view class="row">
            <view class="col">单次学习开始时间</view>
            <view class="col">单次学习结束时间</view>
            <view class="col">IP地址</view>
          </view>
          <view class="row">
            <view class="col">{{ item.starttime }}</view>
            <view class="col">{{ item.endtime }}</view>
            <view class="col">{{ item.ip }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { buildLearnRecord } from '@/api/course'

export default {
  data() {
    return {
      defaultTitle: '学习记录',
      course_id: '',
      tableData: {
        "name": "XXX",
        "id_card": "1***********5",
        "stunum": "100010000000055",
        "busitype": "取证",
        "apcategory": "特种作业人员",
        "total_hour": 3,
        "start_date": "2022-06-07",
        "end_date": "2022-06-14",
        "completed_hour": 3,
        "org_name": "xxx机构",
        "today": "2022年06月06日",
        "certificate_stamp": "http://xxx.png",
      },

      listData: {
        "total": 1,
        "per_page": 20,
        "current_page": 1,
        "last_page": 1,
        "data": [
          {
            "course_id": 26,
            "course_title": "低压电工作业初训",
            "starttime": "2022-06-14 11:25:04",
            "endtime": "2022-06-14 11:32:15",
            "ip": "127.0.0.1"
          }
        ]
      }
    }
  },
  onLoad(options) {
    let { course_id } = options
    this.course_id = course_id
    // this.buildLearnRecord()
  },
  methods: {
    async buildLearnRecord() {
      let params = { course_id: this.course_id }
      let res = await buildLearnRecord(params)
      if (res.code === 0) {
        this.tableData = res.data
        this.listData = res.data.list
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.learning-records {
  width: 100%;
}
</style>