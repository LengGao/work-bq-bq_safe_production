<template>
  <view>
    <Collapse @change="() => {}" v-for="item in catalogues" :key="'s'+ item.id">
      <CollapseItem :title="item.title">
        <Collapse @change="() => {}" v-for="item2 in item.list" :key="item2.id">
          <CollapseItem :title="item2.title">
            <Collapse @change="() => {}" v-for="item3 in item2.list" :key="item3.id">
               <CollapseItem :title="item3.title">
               </CollapseItem>
            </Collapse>
          </CollapseItem>
        </Collapse>
      </CollapseItem>
    </Collapse>
  </view>
</template>

<script>
import Collapse from './Collapse'
import CollapseItem from './CollapseItem'

export default {
  components: {
    'Collapse': Collapse,
    'CollapseItem': CollapseItem
  },
  data() {
    return {
      current: [],
      current2: [],
      current3: [],
      current_id: 1,
      catalogues: [
        {
          id: 1,
          title: '1',
          istree: true,
          list: [
            {
              id: 3,
              title: '1-1',
              istree: true,
              list: [
                {
                  id: 9,
                  title: '1-1-1',
                  istree: false
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    onChange(e) {
      console.log('e', e);
    }
  },
  render(h) {
    let list = this.catalogues, nodes = []
    const collapseOption = {}
    const collapseItemOption = { props: {title: 'a'} }

    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item.istree) {
        nodes.push(h('collapse', collapseOption))
        for(let ii = 0; ii < item.list.length; ii++) {
          const item2 = item.list[ii]
          console.log('tem2', item2);
          if (!item2.istree) {
            nodes[nodes.length -1].children = []
            console.log(nodes[nodes.length -1]);
            nodes[nodes.length -1].children.push(h('collapseItem', collapseItemOption, 'asdsadsad'))
          }
        }
      }

    }

    console.log('nodes',nodes);
    return h('view', {} , nodes)
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

::v-deep .CollapseItem-content {
  position: relative;
}
</style>

