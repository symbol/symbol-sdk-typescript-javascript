<template>
  <div class="communityPanelWrap clear">
    <div class="communityPanel">
      <div class="communityPanelNav left">
        <ul class="navList clear">
          <li :class="[item.active?'active':'','left',item.disabled?'disabled':'']"
              v-for="(item,index) in navList"
              :key="index"
              @click="goToPage(item)">
            {{$t(item.name)}}
          </li>
        </ul>
      </div>
      <div class="contentPanel radius">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import './CommunityPanel.less'
    // @ts-ignore
    import {CommunityPanelTs} from '@/views/community/community-panel/CommunityPanelTs.ts'

    export default class CommunityPanel extends CommunityPanelTs {

    }
</script>

<style scoped>

</style>
