<template>
  <view class="catalogue">
    <collapse ref="catalogue">
      <collapse-item v-for=" item1 in chapterList" :key="item1.id">
        <template v-slot:title>
          <view class="title one-title" :class="item1.checked ? 'title-active' : ''" @click="() => onClickOne(item1)">
            <view class="title-box">
              {{ item1.title }}
              <view v-if="item1.duration" class="tag">试看</view>
            </view>
            <!-- <uni-icons type="eye" size="28rpx" /> -->
          </view>
        </template>

        <collapse-item v-for="item2 in item1.sub" :key="item2.id">
          <template v-slot:title>
            <view class="title two-title" :class="item2.checked ? 'title-active' : ''" @click="() => onClickTwo(item2)">
              <view class="title-box">
                {{ item2.title }}
                <view v-if="item2.duration" class="tag">试看</view>
              </view>
              <!-- <uni-icons type="eye" size="28rpx" /> -->
            </view>
          </template>

          <view v-for="item3 in item2.lesson" :key="item3.id" class="title three-title"
                :class="item3.checked ? 'title-active' : ''" @click="() => onClickThree(item3)">
            <view class="title-box">
              {{ item3.title }}
              <view v-if="item3.duration" class="tag">试看</view>
            </view>
            <text>{{ item3.duration }} 分钟</text>
            <!-- <uni-icons type="eye" size="28rpx" /> -->
          </view>

        </collapse-item>
      </collapse-item>
    </collapse>
  </view>
</template>

<script>
import Collapse from './Collapse'
import CollapseItem from './CollapseItem'
import { chapterList } from '@/api/course'

export default {
  components: {
    Collapse,
    CollapseItem
  },
  props: {
    courseId: {
      type: [String, Number],
      default: '',
    }
  },
  computed: {
  },
  mounted() {
    this.getChapterList()
  },
  data() {
    return {
      checkeds: [],
      checkeds2: [],
      checkeds3: [],
      chapterList: []
    }
  },
  methods: {
    onChangeCollapse(e) {
      // this.$refs.catalogue.resize()
    },
    onClickOne(item) {
      this.checkeds = this.updateChapterList(this.checkeds, item.id)
      this.checkeds2 = this.updateChapterList(this.checkeds2, item.id)
      this.checkeds3 = this.updateChapterList(this.checkeds3, item.id)
      item.checked = !item.checked
      this.checkeds.push(item)
    },
    onClickTwo(item) {
      this.checkeds2 = this.updateChapterList(this.checkeds2, item.id)
      this.checkeds3 = this.updateChapterList(this.checkeds3, item.id)
      item.checked = !item.checked
      this.checkeds2.push(item)
    },
    onClickThree(item) {
      this.checkeds3 = this.updateChapterList(this.checkeds3, item.id)
      item.checked = !item.checked
      this.checkeds3.push(item)
      this.$emit('videoChange', item)
      // this.$forceUpdate()
    },
    updateChapterList(list, id) {
      return list.filter(item => {
        if (item.id !== id) {
          item.checked = false
          return false
        } else {
          return item
        }
      })
    },
    assembleData(list) {
      for (let i = 0, ii = list.length; i < ii; i++) {
        let item = list[i]
        item.checked = false
        if (item.sub && item.sub.length > 0) {
          item.sub = this.assembleData(item.sub)
        } else if (item.lesson && item.lesson.length > 0) {
          item.lesson = this.assembleData(item.lesson)
          console.log('lesson', item.lesson);
        }
      }
      return list
    },
    // 章节目录
    async getChapterList() {
      let param = { course_id: this.courseId }
      let res = await chapterList(param)
      if (res.code == 0) {
        this.chapterList = this.assembleData(res.data)
      }
    },
  }, // methods end
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
  padding: 10rpx 20rpx;
  font-size: $font-size-base;
}

.one-title {
  font-weight: bold;
}

.two-title {
  margin-left: 30rpx;
  color: #333;
}

.three-title {
  margin-left: 60rpx;
  margin-right: 60rpx;
  color: #777;
}

.title-active {
  color: #199fff;
}

.tag {
  display: inline-block;
  margin-left: 16rpx;
  padding: 2rpx 6rpx 6rpx;
  font-size: $font-size-sm;
  line-height: $font-size-sm;
  height: $font-size-sm;
  text-align: center;
  color: $color-primary;
  border: 2rpx solid $color-primary;
  box-sizing: content-box;
}
</style>

