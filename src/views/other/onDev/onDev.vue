<template>
  <div class="onDevWrap">
    <p class="remindTxt">{{$t('not_yet_open')}}</p>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import './onDev.less';

    @Component({
        components: {}
    })
    export default class onDev extends Vue {

    }
</script>

<style scoped>

</style>
