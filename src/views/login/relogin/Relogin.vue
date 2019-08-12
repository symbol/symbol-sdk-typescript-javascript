<template>
  <div class="relogin_container radius scroll" style="position:relative">

    <div class="video-box" style="position: absolute;">
      <video autoplay="autoplay" loop="loop" muted="muted" style="width:100%; height:100%; object-fit: contain">
        <source src="https://nem.io/wp-content/uploads/2017/08/022255374-flight-over-clouds.mp4" type="video/mp4">
      </video>
    </div>

    <div class="top_slogan" style="position: absolute;z-index: 100;">
      <img src="@/common/img/login/relogin/reloginNemLogo.png" alt="">
      <span>
        <div class="top">{{$t('welcome_back_to_the_CATAPULT_beta')}}</div>
        <div class="bottom">{{$t('this_is_a_distributed_desktop_wallet_based_on_CATAPULT_I_wish_you_a_pleasant_trip')}}</div>
      </span>
    </div>

    <div class="middle_icon" style="position: absolute;z-index: 100; left:50%;transform: translate(-50%, -50%);top:30%">
      <div class="icon_content">
        <div class="icon_item" v-for="i in iconList" @mouseover="changeText($t(i.text))">
          <img :src="i.icon" alt="">
        </div>
      </div>

      <div class="icon_text" style="position: absolute;z-index: 100;left:50%;transform: translate(-50%, -50%);">
        {{currentText}}
      </div>

    </div>

    <div class="bottom_login" style="position: absolute;z-index: 100;left:50%;transform: translate(-50%, -50%);top:60%">
      <div class="bottom_content">
        <div class="top_password">
          <input type="password" v-model="form.password" placeholder="Lock Password">
          <img src="@/common/img/login/relogin/reloginDoubt.png" alt="">
        </div>
        <div @click="jumpToDashBoard" class="bottom_button pointer"> LOG IN</div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
    import {Message} from "config/index"
    import {Crypto, UInt64} from 'nem2-sdk'
    import {localRead} from '@/help/help.ts'
    import {Component, Vue} from 'vue-property-decorator'
    import reloginFile from '@/common/img/login/relogin/reloginFile.png'
    import reloginLink from '@/common/img/login/relogin/reloginLink.png'
    import reloginSend from '@/common/img/login/relogin/reloginSend.png'
    import reloginAsset from '@/common/img/login/relogin/reloginAsset.png'
    import reloginAddress from '@/common/img/login/relogin/reloginAddress.png'
    import reloginWidgets from '@/common/img/login/relogin/reloginWidgets.png'
    import reloginNamespace from '@/common/img/login/relogin/reloginNamespace.png'
    import reloginApostille from '@/common/img/login/relogin/reloginApostille.png'


    @Component
    export default class MonitorRelogin extends Vue {
        currentText: any = ''
        form = {
            password: ''
        }
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
                text: 'assign_tags_to_addresses_to_easily_track_contacts'
            }, {
                icon: reloginWidgets,
                text: 'use_Changelly_and_ShapeShift_widgets_to_buy_XEM_at_the_best_rates'
            }
        ]


        changeText(text) {
            this.currentText = text
        }

        created() {
            this.$store.state.app.unClick = true
            this.currentText = this['$t'](this.iconList[0].text)
        }

        checkLock() {
            let lock:any = localRead('lock')
            try {
                const u = [50, 50]
                lock = JSON.parse(lock)
                let saveData = {
                    ciphertext: lock.ciphertext,
                    iv: lock.iv.data,
                    key: this.form.password
                }
                const enTxt = Crypto.decrypt(saveData)
                if (enTxt !== new UInt64(u).toHex()) {
                    this.$Message.error(Message.WRONG_PASSWORD_ERROR);
                    return false
                }
                return true
            } catch (e) {
                this.$Message.error(Message.WRONG_PASSWORD_ERROR);
                return false
            }
        }

        jumpToDashBoard() {
            if (!this.checkLock()) return
            if (this.$store.state.app.walletList.length == 0) {
                this.$router.push({
                    name: 'walletPanel',
                    params: {
                        create: 'true'
                    }
                })
            } else {
                this.$store.state.app.isInLoginPage = false
                this.$router.push({
                    name: 'dashBoard'
                })
            }
        }
    }
</script>
<style scoped lang="less">
  @import "Relogin.less";
</style>
