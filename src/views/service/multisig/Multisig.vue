<template>
  <div class="setting_container scroll radius">
    <div class="navigator radius">
      <span @click="currentImg = map">Map</span>|
      <span @click="currentImg = convert">Convert</span>|
      <span @click="currentImg = manage">Manage</span>
    </div>

    <div class="sub_img_container">
      <div class="white_wrap">{{$t('not_yet_open')}}</div>
      <img :src="currentImg" alt="">

    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import map from '../../../assets/images/service/test/map.png'
    import convert from '@/assets/images/service/test/convert.png'
    import manage from '@/assets/images/service/test/manage.png'

    @Component
    export default class Setting extends Vue {

        map = map
        convert = convert
        manage = manage
        currentImg = map


        // navagatorList = [
        //     {
        //         title: 'general_settings',
        //         name: 'settingNormal',
        //         isSelected: true
        //     }, {
        //         title: 'lock_password',
        //         name: 'settingLock',
        //         isSelected: false
        //     }, {
        //         title: 'network_settings',
        //         name: 'settingNetwork',
        //         isSelected: false
        //     }, {
        //         title: 'about',
        //         name: 'settingAbout',
        //         isSelected: false
        //     }
        // ]
        // currentHeadText = ''
        //
        // jumpToView(n, index) {
        //     let list = this.navagatorList
        //     list.map((item) => {
        //         item.isSelected = false
        //         return item
        //     })
        //     list[index].isSelected = true
        //     this.navagatorList = list
        //     this.currentHeadText = n.title
        //     this.$router.push({
        //         name: n.name
        //     })
        // }
        //
        // created() {
        //     this.currentHeadText = this.navagatorList[0].title
        // }


    }
</script>
<style scoped lang="less">
  @import "Multisig.less";
</style>
