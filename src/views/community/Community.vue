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
    import './Community.less'
    // @ts-ignore
    import {CommunityTs} from '@/views/community/CommunityTs.ts'

    export default class Community extends CommunityTs {

    }
</script>

<style scoped>

</style>
