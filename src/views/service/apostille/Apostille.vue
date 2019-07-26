<template>
  <div class="apostille">
        <div class="white_wrap">{{$t('not_yet_open')}}</div>
<!--    <img :src="manage" alt="">-->
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import manage from '@/assets/images/service/test/manage.png'
    @Component
    export default class Apostille extends Vue {
        manage = manage

    }
</script>
<style scoped lang="less">
@import "Apostille.less";
</style>
