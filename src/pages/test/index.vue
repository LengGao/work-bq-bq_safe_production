<template>
  <view class="test">
    <view class="my-picker">

      <mescroll-body>
        <view></view>

      </mescroll-body>
    </view>
    
  </view>
</template>

<script>
import mescrollBody from '../../uni_modules/mescroll-uni/components/mescroll-body/mescroll-body.vue';
export default {
  components: { mescrollBody },
  data() {
    return {
      data: [
        { id: 1, name: 'a' },
        { id: 2, name: 'a' },
        { id: 3, name: 'a' },
        { id: 4, name: 'a' },
        { id: 5, name: 'a' },
        { id: 6, name: 'a' },
        { id: 7, name: 'a' },
        { id: 8, name: 'a' },
        { id: 9, name: 'a' },
        { id: 10, name: 'a' },
      ],
      down: {}
    };
  },
  methods: {
      downFn(e) {
        console.log('d',e);
      },
      onchange(e) {
        const value = e.detail.value
      },
      onnodeclick(node) {
      },
      bindPickerChange() {
        
      }
  
  },
};
</script>

<style>


</style>