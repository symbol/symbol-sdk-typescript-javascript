<template>
  <div class="setting_wrap">
    <div class="setting_container scroll radius">
      <div class="setting_head">
      </div>
      <div class="setting_main_container">
        <div class=" left">
          <div class="navigator_item pointer" @click="jumpToView(n,index)" v-for="(n,index) in navigatorList">
            <span :class="[routeName == n.name ? 'selected_title':'',n.meta.disabled?'disabled':'']">{{$t(n.meta.title)}}</span>
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
    //@ts-ignore
    import {SettingTs} from '@/views/setting/SettingTs.ts'

    export default class Setting extends SettingTs {

    }
</script>
<style scoped lang="less">
  @import "./Setting.less";
</style>
