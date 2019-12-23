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
               <SignerSelector v-model="formItems.multisigPublicKey" />
              </span>
            </div>

            <div class="multisig_property_amount">
              <span class="gray_content">
                <div class="title">{{$t(formLabels[mode].approvalFieldName)}}</div>
                <div
                  class="title_describe"
                >{{$t(formLabels[mode].approvalFieldDescription)}}</div>
                <div class="input_content">
                  <ErrorTooltip fieldName="minApproval" placementOverride="top">
                    <input
                      v-focus
                      class="radius"
                      v-model="formItems.minApproval"
                      :data-vv-as="$t(formLabels[mode].approvalFieldName)"
                      data-vv-name="minApproval"
                      v-validate="`integer|${validations.minApproval}`"
                    />
                  </ErrorTooltip>
                </div>
              </span>

              <span class="gray_content">
                <div class="title">{{$t(formLabels[mode].removalFieldName)}}</div>
                <div class="title_describe">{{$t(formLabels[mode].removalFieldDescription)}}</div>
                <div class="input_content">
                  <ErrorTooltip fieldName="minRemoval" placementOverride="top">
                    <input
                      class="radius"
                      v-model="formItems.minRemoval"
                      :data-vv-as="$t(formLabels[mode].removalFieldName)"
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
                <span @click="addCosigner(AddOrRemove.ADD)" class="add_button radius pointer">+</span>
                <span
                  v-if="mode === MULTISIG_FORM_MODES.MODIFICATION"
                  @click="addCosigner(AddOrRemove.REMOVE)"
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
                <div class="list_container radius scroll">
                  <div class="list_head">
                    <span class="address_alias">{{$t('Address')}}</span>
                    <span class="action">{{$t('operation')}}</span>
                    <span class="delete">&nbsp;</span>
                  </div>

                  <div class="list_body scroll">
                    <div
                      class="please_add_address"
                      v-if="!cosignatoryModifications.modifications.length"
                    >{{$t('The_action_list_is_empty')}}</div>

                    <div
                      class="list_item radius"
                      v-for="({addOrRemove, cosignatory}, index) in cosignatoryModifications.modifications"
                      :key="index"
                    >
                      <span class="address_alias">{{ cosignatory.address.pretty() }}</span>
                      <span
                        class="action"
                      >{{ $t(`${addOrRemove}`) }}</span>
                      <img
                        class="delete pointer"
                        @click="removeCosigner(index)"
                        src="@/common/img/service/multisig/multisigDelete.png"
                        alt
                      />
                    </div>
                  </div>
                  <input
                          v-model="cosignatoryModifications.modifications.length"
                          data-vv-name="cosigners"
                          v-validate="validations.cosigners"
                          :data-vv-as="$t('cosigners')"
                          v-show="false"
                  />
                </div>
              </ErrorTooltip>
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
import { MultisigAccountModificationTs } from "@/components/forms/multisig-account-modification/MultisigAccountModificationTs.ts";
import "./MultisigAccountModification.less";
export default class MultisigAccountModification extends MultisigAccountModificationTs {}
</script>
