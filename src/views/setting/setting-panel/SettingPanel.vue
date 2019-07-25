<template>
  <div class="setting_wrap">
    <div class="white_wrap">{{$t('not_yet_open')}}</div>
    <div class="setting_container scroll radius">
      <div class="setting_head">
        {{$t('setting')}}
      </div>
      <div class="seeting_main_container">
        <div class="left_navigator left">
          <div class="navigator_item pointer" @click="jumpToView(n,index)" v-for="(n,index) in navagatorList">
            <span :class="n.isSelected ? 'selected_title':''">{{$t(n.title)}}</span>
          </div>
        </div>
        <div class="right_view right">
          <div class="top_title">
            {{$t(currentHeadText)}}
          </div>
          <div class="main_view">
            <router-view/>
          </div>
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
                title: 'general_settings',
                name: 'settingNormal',
                isSelected: true
            }, {
                title: 'lock_password',
                name: 'settingLock',
                isSelected: false
            }, {
                title: 'network_settings',
                name: 'settingNetwork',
                isSelected: false
            }, {
                title: 'about',
                name: 'settingAbout',
                isSelected: false
            }
        ]
        currentHeadText = ''

        jumpToView(n, index) {
            let list = this.navagatorList
            list.map((item) => {
                item.isSelected = false
                return item
            })
            list[index].isSelected = true
            this.navagatorList = list
            this.currentHeadText = n.title
            this.$router.push({
                name: n.name
            })
        }

        created() {
            this.currentHeadText = this.navagatorList[0].title
        }

    }
</script>
<style scoped lang="less">
  @import "./SettingPanel.less";
</style>
