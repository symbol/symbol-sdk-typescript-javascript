<template>
  <div v-if="active" class="multisig_ban_container">
    <Alert type="error">{{$t(alertMessage)}}</Alert>
    <div class="is_multisig un_click radius"></div>
  </div>
</template>

<script lang="ts">
    import {DisabledFormsTs} from '@/components/disabled-forms/DisabledFormsTs.ts'

    export default class DisabledForms extends DisabledFormsTs {

    }
</script>
<style scoped lang="less">
  @import "DisabledForms.less";
</style>
