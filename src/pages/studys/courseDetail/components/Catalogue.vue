<template>
  <view class="catalogue">
    <collapse ref="catalogue" v-model="currents" @change="onChangeCollapse">
      <collapse-item  v-for=" item1 in catalogues" :key="'1_' + item1.id">
        <template v-slot:title>
          <view class="title one-title">
            一级目录
            <uni-icons type="wallet" size="28rpx" />
          </view>
        </template>
        <collapse-item  v-for="item2 in item1.list" :key="'2_' + item2.id">
          <template v-slot:title>
            <view class="title two-title">
              二级目录
              <uni-icons type="wallet" size="28rpx" />
            </view>
          </template>
          <view class="title three-title"
            v-for="item3 in item2.list" :key="'3_' + item3.id" @click="onClickThree">
            三级目录
          </view>
        </collapse-item>
      </collapse-item>
    </collapse>
  </view>
</template>

<script>
import Collapse from './Collapse.vue'
import CollapseItem from './CollapseItem.vue'

export default {
  components: {
    Collapse,
    CollapseItem
  },
  data() {
    return {
      collapseOpen: false,
      currentId: 1,
      currents: [],
      catalogues: [
        {
          id: 1,
          title: '1',
          istree: true,
          type: 'one',
          list: [
            {
              id: 3,
              title: '1-1',
              istree: true,
              type: 'two',
              list: [
                {
                  id: 9,
                  title: '1-1-1',
                  istree: false,
                  type: 'three',
                  list: []
                },
                {
                  id: 11,
                  title: '1-1-1',
                  istree: false,
                  list: []
                },
                {
                  id: 12,
                  title: '1-1-1',
                  istree: false,
                  list: []
                }
              ]
            },
            {
              id: 33,
              title: '1-2',
              istree: true,
              list: [
                {
                  id: 22,
                  title: '1-2-1',
                  istree: false,
                  list: []
                }
              ]
            }
          ]
        },
        {
          id: 2,
          title: '2',
          istree: true,
          list: [
            {
              id: 4,
              title: '2-1',
              istree: true,
              list: [
                {
                  id: 8,
                  title: '2-1-1',
                  istree: false,
                  list: []
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    onChangeCollapse(e) {
      console.log('e', e);
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

.three-title  {
  margin-left: 60rpx;
  color: #777;
}

.title-active{
  color: #199fff;
}

</style>

