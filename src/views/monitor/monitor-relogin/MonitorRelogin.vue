<template>
  <div class="relogin_container radius scroll">
    <div class="top_slogan">
      <img src="../../../assets/images/relogin/reloginNemLogo.png" alt="">
      <span>
        <div class="top">{{$t('welcome_back_to_the_CATAPULT_beta')}}</div>
        <div class="bottom">{{$t('this_is_a_distributed_desktop_wallet_based_on_CATAPULT_I_wish_you_a_pleasant_trip')}}</div>
      </span>
    </div>

    <div class="middle_icon">
      <div class="icon_content">
        <div class="icon_item" v-for="i in iconList" @mouseover="changeText($t(i.text))">
          <img :src="i.icon" alt="">
        </div>
      </div>

      <div class="icon_text">
        {{currentText}}
      </div>

    </div>

    <div class="bottom_login">
      <div class="bottom_content">
        <div class="top_password">
          <input type="text" placeholder="Lock Password">
          <img src="../../../assets/images/relogin/reloginDoubt.png" alt="">
        </div>
        <div @click="jumpToDashBoard" class="bottom_button pointer"> LOG IN</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import reloginAddress from '../../../assets/images/relogin/reloginAddress.png'
    import reloginApostille from '../../../assets/images/relogin/reloginApostille.png'
    import reloginAsset from '../../../assets/images/relogin/reloginAsset.png'
    import reloginFile from '../../../assets/images/relogin/reloginFile.png'
    import reloginLink from '../../../assets/images/relogin/reloginLink.png'
    import reloginNamespace from '../../../assets/images/relogin/reloginNamespace.png'
    import reloginSend from '../../../assets/images/relogin/reloginSend.png'
    import reloginWidgets from '../../../assets/images/relogin/reloginWidgets.png'


    @Component
    export default class MonitorRelogin extends Vue {
        iconList = [
            {
                icon: reloginSend,
                text: 'send_and_receive_XEM_almost_instantly_in_just_1_minute'
            }, {
                icon: reloginFile,
                text: 'provides_an_editable_chain_on_protocol_in_a_multi_signature_account_which_is_the_best_way_to_store_funds_and_achieve_a_common_account'
            }, {
                icon: reloginNamespace,
                text: 'a_namespace_is_a_domain_name_that_stores_mosaics_Each_namespace_is_unique_within_a_blockchain_and_mosaics_can_be_defined_and_authenticated_on_a_multi_level_sub_namespace'
            }, {
                icon: reloginAsset,
                text: 'NEM_Mosaic_is_a_smart_asset_with_rich_attributes_and_features_To_create_a_mosaic_you_must_provision_the_root_namespace_for_your_account'
            }, {
                icon: reloginLink,
                text: 'entrusted_harvesting_is_a_way_to_achieve_remote_online_mining_without_having_to_keep_the_original_account_open'
            }, {
                icon: reloginApostille,
                text: 'use_the_NEM_Apostille_service_to_create_blockchain_notarized_timestamps_to_track_and_audit_file_authentication_status'
            }, {
                icon: reloginAddress,
                text: 'assign_tags_to_addresses_to_easily_track_contacts.'
            }, {
                icon: reloginWidgets,
                text: 'use_Changelly_and_ShapeShift_widgets_to_buy_XEM_at_the_best_rates'
            }
        ]
        currentText = ''


        changeText(text) {
            this.currentText = text
        }

        created() {
            this.$store.state.app.unClick = true
            this.currentText = this.iconList[0].text
        }
        jumpToDashBoard(){
            this.$store.state.app.unClick = false
            this.$router.push({
                name:'dashBoard'
            })
        }
    }
</script>
<style scoped lang="less">
  @import "MonitorRelogin.less";
</style>
