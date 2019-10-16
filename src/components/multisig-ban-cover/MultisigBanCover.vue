<template>
  <div v-if="isMultisig" class="multisig_ban_container">
    <Alert type="error">{{$t('Multisig_accounts_can_not_send_a_transaction_by_themselves')}}</Alert>
    <div class="is_multisig un_click radius"></div>
  </div>
</template>

<script lang="ts">
    import {MultisigBanCoverTs} from '@/components/multisig-ban-cover/MultisigBanCoverTs.ts'

    export default class MultisigBanCover extends MultisigBanCoverTs {

    }
</script>
<style scoped lang="less">
  @import "MultisigBanCover.less";
</style>
