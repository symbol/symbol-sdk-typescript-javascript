<template>
  <div class="setting_container scroll radius">
    <div class="setting_head">
      设置
    </div>
    <div class="seeting_main_container">
      <div class="left_navigator left">
        <div class="navigator_item pointer" @click="jumpToView(n)" v-for="n in navagatorList">
          {{n.title}}
        </div>
      </div>
      <div class="right_view right">
        <div class="top_title">
          {{currentHeadText}}
        </div>
        <div class="main_view">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Setting extends Vue {
        navagatorList = [
            {
                title: '常规设置',
                name: 'settingNormal'
            }, {
                title: '锁密码',
                name: 'settingLock'
            }, {
                title: '网络设置',
                name: 'settingNetwork'
            }, {
                title: '关于',
                name: 'settingAbout'
            }
        ]
        currentHeadText = ''

        jumpToView(n) {
            this.currentHeadText = n.title
            this.$router.push({
                name: n.name
            })
        }
        created(){
            this.currentHeadText = this.navagatorList[0].title
        }

    }
</script>
<style scoped lang="less">
  @import "./SettingPanel.less";
</style>
