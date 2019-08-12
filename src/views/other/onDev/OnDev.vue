<template>
  <div class="onDevWrap">
    <p class="remindTxt">{{$t('not_yet_open')}}</p>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import './OnDev.less';

    @Component
    export default class onDev extends Vue {

    }
</script>

<style scoped>

</style>
