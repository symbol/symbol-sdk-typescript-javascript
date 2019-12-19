<template>
  <div>
    <AccountLinkTransaction
      v-if="showAccountLinkTransactionForm"
      :visible="showAccountLinkTransactionForm"
      @close="showAccountLinkTransactionForm = false"
    />
    <CreateRemoteAccount
      v-if="showCreateRemoteAccountForm"
      :visible="showCreateRemoteAccountForm"
      :viewAccountPropertiesOnly="viewAccountPropertiesOnly"
      @openAccountLinkTransaction="showCreateRemoteAccountForm = false; showAccountLinkTransactionForm = true"
      @close="showCreateRemoteAccountForm = false"
    />
    <PersistentDelegationRequest
      v-if="showPersistentDelegationForm"
      :visible="showPersistentDelegationForm"
      @close="showPersistentDelegationForm = false"
    />

    <div class="remote_board_container secondary_page_animate scroll">
      <div class="top_network_info radius scroll">
        <div class="remote_total">

          <div class="state_class">
            <div class="div_cer">
              <span class="remote_public_key">{{$t('Remote_state')}}：</span>
              <span>{{ $t(isLinked?'Linked':'Not_linked') }}</span>
              <button
                :class="[isLinked?'toggle_link_button_to_unlink':'toggle_link_button_to_link','pointer']"
                @click="linkAccountClicked"
              >{{ $t(getActionButtonText()) }}</button>
              <button
                v-if="linkedAccountKey"
                class="toggle_link_button_to_link pointer"
                @click="activateRemoteHarvesting"
              >{{ $t('Activate_remote_harvesting') }}</button>
            </div>

            <div v-if="remoteAccountPublicKey" class="top_class_div">
              <span class="remote_public_key">{{$t('Remote_public_key')}}：</span>
              <span class="text_select">{{ remoteAccountPublicKey }}</span>
              <span
                v-if="!remoteAccountPrivatekey && remoteAccount"
                class="link clearfix"
                @click="showCreateRemoteAccountForm = true ; viewAccountPropertiesOnly = true"
              >{{ $t('Show_remote_account_details') }}</span>

              <div
                v-if="remoteAccountPublicKey && !remoteAccount"
                @click="showCreateRemoteAccountForm = true ; viewAccountPropertiesOnly = false"
              >
                <span class="link">{{ $t('Import_your_remote_account_in_the_wallet') }}</span>
              </div>

              <div>
                <span v-if="remoteAccountPrivatekey">
                  {{ remoteAccountPrivatekey }}
                  <span
                    class="link"
                    @click="remoteAccountPrivatekey = null"
                  >{{ $t('Hide') }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="question_class">
          <div>
            <div class="wid_bord_class">
              <span class="bord_class">{{$t('what_is_delegated_harvesting')}}</span>
            </div>
            <div class="content_des">
              <p class="content_font">{{$t('Delegated_harvesting_text_1')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "./WalletHarvesting.less";
// @ts-ignore
import { WalletHarvestingTs } from "@/views/wallet/wallet-details/wallet-function/wallet-harvesting/WalletHarvestingTs.ts";

export default class WalletHarvesting extends WalletHarvestingTs {}
</script>

<style scoped lang="less">
</style>
