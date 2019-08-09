<template>
  <div class="multisig_map_container">
    <div class="multisig_head_title">{{$t('Current_wallet_multi_sign_relationship_map')}}</div>
    <div class="multisig_tips">
      <span class="tips_title">{{$t('prompt')}}:</span>
      <span class="tips_describe">{{$t('Multi_signature_depth_support_3_layers_multi_sign_account_can_have_up_to_10_signatures_account_can_be_the_signer_of_5_multi_sign_accounts')}}</span>
    </div>

    <div class="map_container">
      <TopographicMap></TopographicMap>
    </div>
  </div>
</template>

<script lang="ts">
    import TopographicMap from './TopographicMap.vue'
    import {Component, Vue} from 'vue-property-decorator';
    @Component({
        components:{
            TopographicMap
        }
    })
    export default class MultisigMap extends Vue {


    }
</script>
<style scoped lang="less">
  @import "MultisigMap.less";
</style>
