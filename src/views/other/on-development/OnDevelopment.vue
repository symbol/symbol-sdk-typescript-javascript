<template>
  <div class="onDevWrap">
    <p class="remindTxt">{{$t('not_yet_open')}}</p>
  </div>
</template>

<script lang="ts">
    import './OnDevelopment.less'
    import {OnDevelopmentTs} from './OnDevelopmentTs'

    export default class OnDevelopment extends OnDevelopmentTs {

    }
</script>

<style scoped>

</style>
