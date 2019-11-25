<template>
  <div class="multisig_form_container">
    <div class="left_form radius scroll">
      <div v-if="!displayForm" class="multisig_convert_container secondary_page_animate">
        <div class="multisig_convert_head">{{ $t(formHeadline) }}</div>
      </div>
      <div v-if="displayForm" class="multisig_convert_container secondary_page_animate">
        <DisabledForms />
        <form onsubmit="event.preventDefault()" @keyup.enter="submit">
          <div class="multisig_convert_head">{{ $t(formHeadline) }}</div>
          <div class="convert_form">
            <p
              v-if="mode === MULTISIG_FORM_MODES.CONVERSION"
              class="title"
            >Account to be converted: {{Address.createFromRawAddress(wallet.address).pretty()}} ({{wallet.name}})</p>

            <div
              v-if="hasMultisigAccounts && mode === MULTISIG_FORM_MODES.MODIFICATION"
              class="multisig_add"
            >
              <div class="title">{{ $t('sender') }}</div>
              <span class="multisig_property_fee">
                <Select
                  :placeholder="$t('publicKey')"
                  v-model="formItems.multisigPublicKey"
                  class="select"
                >
                  <Option
                    v-for="item in multisigPublicKeyList"
                    :value="item.publicKey"
                    :key="item.publicKey"
                  >{{ item.address }}</Option>
                </Select>
              </span>
            </div>

            <div class="multisig_property_amount">
              <span class="gray_content">
                <div class="title">{{$t('min_approval')}}</div>
                <div
                  class="title_describe"
                >{{$t('Min_signatures_to_sign_a_transaction_or_to_add_a_cosigner')}}</div>
                <div class="input_content">
                  <ErrorTooltip fieldName="minApproval" placementOverride="top">
                    <input
                      v-focus
                      class="radius"
                      v-model="formItems.minApproval"
                      :data-vv-as="$t('min_approval')"
                      data-vv-name="minApproval"
                      v-validate="`integer|${validations.minApproval}`"
                    />
                  </ErrorTooltip>
                </div>
              </span>

              <span class="gray_content">
                <div class="title">{{$t('min_removal')}}</div>
                <div class="title_describe">{{$t('Min_signatures_required_to_remove_a_cosigner')}}</div>
                <div class="input_content">
                  <ErrorTooltip fieldName="minRemoval" placementOverride="top">
                    <input
                      class="radius"
                      v-model="formItems.minRemoval"
                      :data-vv-as="$t('min_removal')"
                      data-vv-name="minRemoval"
                      v-validate="`integer|${validations.minRemoval}`"
                    />
                  </ErrorTooltip>
                </div>
              </span>
            </div>

            <div class="multisig_add gray_content">
              <div class="title title-padding">{{ $t('Add_cosigners') }}</div>
              <div class="input_content">
                <ErrorTooltip fieldName="cosigner" placementOverride="top">
                  <input
                    v-focus
                    data-vv-name="cosigner"
                    v-model="cosignerToAdd"
                    v-validate="'addressOrPublicKey'"
                    :data-vv-as="$t('cosigner')"
                    :placeholder="$t('Address_or_public_key')"
                    type="text"
                  />
                </ErrorTooltip>
                <span
                  @click="addCosigner(CosignatoryModificationAction.Add)"
                  class="add_button radius pointer"
                >+</span>
                <span
                  v-if="mode === MULTISIG_FORM_MODES.MODIFICATION"
                  @click="addCosigner(CosignatoryModificationAction.Remove)"
                  class="delete_button radius pointer"
                >-</span>
              </div>
            </div>

            <div class="cosigner_list">
              <div class="head_title">{{$t('Actions_list')}}</div>
              <ErrorTooltip
                fieldName="cosigners"
                placementOverride="top"
                style="width: 720px; text-align:center"
              >
                <input
                  v-model="formItems.modificationList.length"
                  data-vv-name="cosigners"
                  v-validate="validations.cosigners"
                  :data-vv-as="$t('cosigners')"
                  v-show="false"
                />
              </ErrorTooltip>
              <div class="list_container radius scroll">
                <div class="list_head">
                  <span class="address_alias">{{$t('Address')}}</span>
                  <span class="action">{{$t('operation')}}</span>
                  <span class="delete">&nbsp;</span>
                </div>
                <div class="list_body scroll">
                  <div
                    class="please_add_address"
                    v-if="formItems.modificationList.length == 0"
                  >{{$t('The_action_list_is_empty')}}</div>

                  <div
                    class="list_item radius"
                    v-for="(i,index) in formItems.modificationList"
                    :key="index"
                  >
                    <span class="address_alias">{{i.cosignatoryPublicAccount.publicKey}}</span>
                    <span class="action">
                      {{ i.modificationAction == CosignatoryModificationAction.Add
                      ? $t('add'):$t('cut_back') }}
                    </span>
                    <img
                      class="delete pointer"
                      @click="removeCosigner(index)"
                      src="@/common/img/service/multisig/multisigDelete.png"
                      alt
                    />
                  </div>
                </div>
              </div>

              <div class="multisig_property_fee">
                <div class="title">{{$t('fee')}}</div>
                <Select
                  data-vv-name="fee"
                  class="select"
                  v-model="formItems.feeSpeed"
                  v-validate="'required'"
                  :data-vv-as="$t('fee')"
                  :placeholder="$t('fee')"
                >
                  <Option
                    v-for="item in defaultFees"
                    :value="item.speed"
                    :key="item.speed"
                  >{{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}</Option>
                </Select>
              </div>
            </div>

            <div class="confirm_button pointer" @click="submit">{{ $t('send') }}</div>
          </div>
        </form>
      </div>
    </div>

    <div class="right_multisig_info radius scroll">
      <MultisigTree />
    </div>
  </div>
</template>

<script lang="ts">
import { MultisigTransactionFormTs } from "@/views/multisig/multisig-transaction-form/MultisigTransactionFormTs.ts"
import "./MultisigTransactionForm.less";

export default class MultisigTransactionForm extends MultisigTransactionFormTs {}
</script>
<style scoped lang="less">
</style>
