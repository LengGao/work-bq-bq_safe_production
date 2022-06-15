<template>
  <view class="learning-records">
    <custom-header :title="defaultTitle"></custom-header>
    <view>
      
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
      tableData: {}
    }
  },
  onLoad(options) {
    let {course_id} = options
    this.course_id = course_id
  },
  methods: {
    async buildLearnRecord() {
      let params = { course_id: this.course_id }
      let res = await buildLearnRecord(params)
      if (res.code === 0) {
        this.tableData = res.data
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