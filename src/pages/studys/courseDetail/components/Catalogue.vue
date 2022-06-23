<template>
  <view class="catalogue">
    <collapse ref="catalogue">
      <!-- 一级 -->
      <collapse-item v-for=" item1 in chapterList" :key="item1.id" :open="item1.checked" title-border="show">
        <template v-slot:title>
          <view class="title one-title" :class="item1.checked ? 'title-active' : ''">
            <view class="title-box">
              <view class="title-text">
                {{ item1.title }}
              </view>
              <view v-if="!is_buy && item1.is_try" class="tag">试看</view>
            </view>
          </view>
        </template>

        <!-- 二级 -->
        <view v-if="item1.nodeType === 'sub'">
          <collapse-item v-for="item2 in item1.sub" :key="item2.id" :open="item2.checked" title-border="show">
            <template v-slot:title>
              <view class="title two-title" :class="item2.checked ? 'title-active' : ''">
                <view class="title-box">
                  <view class="title-text">
                    {{ item2.title }}
                  </view>
                  <view v-if="!is_buy && item2.is_try" class="tag">试看</view>
                </view>
              </view>
            </template>

            <!-- 三级 -->
            <template v-if="item2.lesson && item2.lesson.length >0">
              <view v-for="item3 in item2.lesson" :key="item3.id" class="title three-title"
                    :class="item3.checked ? 'title-active' : ''" @click="() => onClickThree(item3, item2, item1)">
                <view class="title-box">
                  <uni-icons v-if="isLocked(item3)" type="locked-filled" size="32rpx" color="#999"
                             style="margin-right: 8rpx" />
                  <uni-icons v-else type="videocam-filled" size="32rpx" :color="item3.checked ? '#199fff' : '#999'"
                             style="margin-right: 8rpx" />
                  <view class="title-text">
                    {{ item3.title }}
                  </view>
                  <view v-if="!is_buy && item3.is_try" class="tag">试看</view>
                </view>
                <text>{{ item3.duration }}</text>
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
              <uni-icons v-if="isLocked(item3)" type="locked-filled" size="32rpx" color="#999"
                         style="margin-right: 8rpx" />
              <uni-icons v-else type="videocam-filled" size="32rpx" :color="item3.checked ? '#199fff' : '#999'"
                         style="margin-right: 8rpx" />
              <view class="title-text">
                {{ item3.title }}
              </view>
              <view v-if="!is_buy && item3.is_try" class="tag">试看</view>
            </view>
            <text>{{ item3.duration }}</text>
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
    lessonId: {
      type: [String, Number],
      default: '',
    }
  },
  watch: {
    courseId(val) {
      console.log('courseId', val);
      this.getChapterList()
    },
    lessonId(val, oldval) {
      console.log("lessonId", val, oldval);
      if (val) {
        this.resetChapterList()
        this.toFlushBack(val, this.chapterList)
      }
    }
  },
  mounted() {
    this.getChapterList()
  },
  data() {
    return {
      is_buy: 0,
      checkeds: [], // 当前选择
      chapterList: [], // 目录
    }
  },
  methods: {
    // 上锁
    isLocked(lesson) {
      return (
        (!this.is_buy && !lesson.is_try) ||
        (this.is_buy && !lesson.learn_status)
      );
    },
    // 三级目录
    onClickThree(item3, item2, item1) {
      if (this.isLocked(item3)) {
        uni.showToast({
          icon: 'none',
          title: this.is_buy ? '请按顺序学习课程' : '请购买课程'
        })
        return
      }
      // learn_status 0 未学习 1 学习中 2，已学完
      let args = [item1, item2, item3]
      this.checkeds = this.updateChapterList(this.checkeds, args)
      this.$emit('videoChange', args)
      // if (item3.learn_status !== 0) {
      //   let args = [item1, item2, item3]
      //   this.checkeds = this.updateChapterList(this.checkeds, args)
      //   this.$emit('videoChange', args)
      // }
    },
    resetChapterList() {
      this.checkeds = this.updateChapterList(this.checkeds, [])
    },
    // 回溯
    toFlushBack(id, list) {
      let parent = {}
      for (let i = 0, ii = list.length; i < ii; i++) {
        let item = list[i], childs = item.sub || item.lesson;

        if (item.id === id) {
          item.checked = true; parent = item; this.checkeds.push(item); break;
        } else {
          item.checked = false;
          if (childs && childs.length) {
            parent = this.toFlushBack(id, childs);
          }
        }

        if (parent.chapter_id === item.id || parent.parent_id === item.id) {
          item.checked = true;
          this.checkeds.push(item);
          // parent = item;
          return parent = item;
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
        let list = this.assembleData(res.data.chapter)
        this.chapterList = list
        this.is_buy = res.data.is_buy
        const lastLessonId = res.data.learning_lesson_id
        if (lastLessonId) {
          this.$emit('last-lesson-id', lastLessonId)
          this.toFlushBack(lastLessonId, list)
        }
        // if (this.lessonId) {
        //   this.toFlushBack(this.lessonId, list)
        // }
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

.title-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.one-title {
  font-weight: bold;
}

.two-title {
  margin-left: 20rpx;
  color: #333;
}

.three-title {
  margin-left: 30rpx;
  margin-right: 10rpx;
  color: #777;
  border-bottom: 2rpx solid #ebeef5;
}

.title-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
}

.title-active {
  color: #199fff;
}

.tag {
  display: inline-block;
  margin: 0 10rpx;
  padding: 2rpx 6rpx 6rpx;
  font-size: $font-size-sm;
  line-height: $font-size-sm;
  height: $font-size-sm;
  text-align: center;
  color: $color-primary;
  white-space: nowrap;
  border: 2rpx solid $color-primary;
}
</style>

