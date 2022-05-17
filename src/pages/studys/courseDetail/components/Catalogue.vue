<template>
  <view class="catalogue">
    <collapse ref="catalogue">
      <!-- 一级 -->
      <collapse-item v-for=" item1 in chapterList" :key="item1.id" :open="item1.checked">
        <template v-slot:title>
          <view class="title one-title" :class="item1.checked ? 'title-active' : ''">
            <view class="title-box">
              {{ item1.title }}
              <view v-if="item1.duration" class="tag">试看</view>
            </view>
          </view>
        </template>

        <!-- 二级 -->
        <view v-if="item1.nodeType === 'sub'">
          <collapse-item v-for="item2 in item1.sub" :key="item2.id" :open="item2.checked">
            <template v-slot:title>
              <view class="title two-title" :class="item2.checked ? 'title-active' : ''">
                <view class="title-box">
                  {{ item2.title }}
                  <view v-if="item2.duration" class="tag">试看</view>
                </view>
              </view>
            </template>

            <!-- 三级 -->
            <template v-if="item2.lesson && item2.lesson.length >0">
              <view v-for="item3 in item2.lesson" :key="item3.id" class="title three-title"
                    :class="item3.checked ? 'title-active' : ''" @click="() => onClickThree(item3, item2, item1)">
                <view class="title-box">
                  {{ item3.title }}
                  <view v-if="item3.duration" class="tag">试看</view>
                </view>
                <text>{{ item3.duration }} 分钟</text>
              </view>
            </template>
            <template v-else>
              <view class="title three-title">
                <view class="title-box">
                  暂无课时
                </view>
              </view>
            </template>
          </collapse-item>
        </view>

        <view v-else>
          <view v-for="item3 in item1.lesson" :key="item3.id" class="title three-title"
                :class="item3.checked ? 'title-active' : ''" @click="() => onClickThree(item3, item1)">
            <view class="title-box">
              {{ item3.title }}
              <view v-if="item3.duration" class="tag">试看</view>
            </view>
            <text>{{ item3.duration }} 分钟</text>
          </view>
        </view>
      </collapse-item>
    </collapse>
  </view>
</template>

<script>
import Collapse from './Collapse'
import CollapseItem from './CollapseItem'
import { courseChapterList } from '@/api/course'

export default {
  components: {
    Collapse,
    CollapseItem
  },
  props: {
    courseId: {
      type: [String, Number],
      default: '',
    },
    learningLessonId: {
      type: [String, Number],
      default: '',
    }
  },
  watch: {
    courseId() {
      this.getChapterList()
    },
    learningLessonId() {
      if (this.learningLessonId) {
        this.toFlushBack(this.learningLessonId, this.chapterList)
      }
    }
  },
  mounted() {
    this.getChapterList()
  },
  data() {
    return {
      checkeds: [], // 当前选择
      chapterList: [], // 目录
    }
  },
  methods: {
    // 三级目录
    onClickThree(item1, item2, item3) {
      let args = [item1, item2, item3]
      this.checkeds = this.updateChapterList(this.checkeds, args)
      this.$emit('videoChange', args)
    },
    // 回溯
    toFlushBack(id, list) {
      let parent = {}
      for (let i = 0, ii = list.length; i < ii; i++) {
        let item = list[i], childs = item.sub || item.lesson;

        if (item.id === id) {
          item.checked = true; parent = item; this.checkeds.push(item); break;
        } else {
          if (childs && childs.length) parent = this.toFlushBack(id, childs);
        }

        if (parent.chapter_id === item.id || parent.parent_id === item.id) {
          item.checked = true; parent = item; this.checkeds.push(item);
        }
      }
      return parent
    },
    // 更新目录
    updateChapterList(list, args) {
      let maxLen = Math.max(list.length, args.length)
      // 目录可能是二级可能是三级
      for (let i = 0; i < maxLen; i++) {
        let item = list[i], arg = args[i]
        if (arg) {
          arg.checked = true
          if (item && item.id !== arg.id) item.checked = false;
          list[i] = arg
        } else {
          if (item) item.checked = false;
          list.length = args.length
        }
      }
      return list
    },
    // 组装数据
    assembleData(list = []) {
      for (let i = 0, ii = list.length; i < ii; i++) {
        let item = list[i]
        item.checked = false
        if (item.sub && item.sub.length) {
          item.nodeType = 'sub' // 章节类型
          item.sub = this.assembleData(item.sub)
        } else if (item.lesson && item.lesson.length) {
          item.nodeType = 'lesson' // 课时类型
          item.lesson = this.assembleData(item.lesson)
        }
      }
      return list
    },
    // 章节目录
    async getChapterList() {
      let param = { course_id: this.courseId }
      let res = await courseChapterList(param)
      if (res.code == 0) {
        let list = this.assembleData(res.data)
        this.chapterList = list
        if (this.learningLessonId) {
          this.toFlushBack(this.learningLessonId, list)
        }
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
  margin-right: 10rpx;
  color: #777;
  border-bottom: 2rpx solid #ebeef5;
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

