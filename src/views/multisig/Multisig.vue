<template>
  <div class="setting_container scroll radius selection_container">
    <div class="top_navigator radius">
      <span class="button_list_item">
        <span
          :class="[ 'name', $route.name === 'multisig.convert' ? 'active' : '','pointer' ]"
          @click="$route.name === 'multisig.convert' ? '' : $router.push({name: 'multisig.convert'})"
        >{{ $t('convert') }}</span>
        <span
          :class="[ 'name', $route.name === 'multisig.manage' ? 'active' : '','pointer' ]"
          @click="$route.name === 'multisig.manage' ? '' : $router.push({name: 'multisig.manage'})"
        >{{ $t('manage') }}</span>
        <span
          :class="[ 'name', $route.name === 'multisig.cosign' ? 'active' : '','pointer' ]"
          @click="$route.name === 'multisig.cosign' ? '' : $router.push({name: 'multisig.cosign'})"
        >{{ $t('cosign_transactions') }}</span>
      </span>
    </div>

    <div class="sub_function_container ">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
@Component
export default class Multisig extends Vue {}
</script>
<style scoped lang="less">
  @import "Multisig.less";
</style>
