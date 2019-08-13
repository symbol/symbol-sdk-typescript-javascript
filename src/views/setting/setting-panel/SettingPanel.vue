<template>
  <div class="setting_wrap">
    <div class="setting_container scroll radius">
      <div class="setting_head">
      </div>
      <div class="seeting_main_container">
        <div class="left_navigator left">
          <div class="navigator_item pointer" @click="jumpToView(n,index)" v-for="(n,index) in navagatorList">
            <span :class="[n.isSelected ? 'selected_title':'',n.disabled?'disabled':'']">{{$t(n.title)}}</span>
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
    import {SettingPanelTs} from './SettingPanelTs'

    export default class SettingPanel extends SettingPanelTs {

    }
</script>
<style scoped lang="less">
  @import "./SettingPanel.less";
</style>
