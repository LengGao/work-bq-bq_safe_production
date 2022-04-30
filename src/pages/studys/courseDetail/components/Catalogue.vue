<script>
import Vue from 'vue'
import Collapse from './Collapse'
import CollapseItem from './CollapseItem'
Vue.component('collapse', Collapse)
Vue.component('collapse-item', CollapseItem)

export default {
  render: function (h) {
    let data = this.catalogues
    let child = this.generatorContent(data)
    let nodes = this.generatorContainer(child)
    return h('view', { class: 'catalogue' }, [nodes])
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
    generatorContent(list) {
      return list.map(item => {
        if (item.istree) {
          return this.$createElement('collapse-item', { props: { title: item.title, type: item.type } }, this.generatorContent(item.list))
        } else {
          return this.$createElement('view', { class: 'last-node', slot: 'default' }, item.title)
        }
      })
    },
    generatorContainer(child) {
      console.log("child", child);
      let options = {
        props: {
          value: this.current
        },
        attrs: {
        },
        on: {
          change(e) {
            console.log("onChange`", e);
          }
        }
      }
      return this.$createElement('collapse', options, child)
    }
  }, // methods end
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
</style>

