<template>
  <div class="multisig_form_container">
    <div class="left_form radius scroll">
      <div v-if="!displayForm" class="multisig_convert_container secondary_page_animate">
        <div class="multisig_convert_head">
          {{ $t(formHeadline) }}
        </div>
      </div>
      <div v-if="displayForm" class="multisig_convert_container secondary_page_animate">
        <DisabledForms />
        <form onsubmit="event.preventDefault()" @keyup.enter="submit">
          <div class="multisig_convert_head">
            {{ $t(formHeadline) }}
          </div>
          <div class="convert_form">
            <p
              v-if="mode === MULTISIG_FORM_MODES.CONVERSION"
              class="title"
            >
              Account to be converted: {{ Address.createFromRawAddress(wallet.address).pretty() }} ({{ wallet.name }})
            </p>

            <div
              v-if="hasMultisigAccounts && mode === MULTISIG_FORM_MODES.MODIFICATION"
              class="multisig_add"
            >
              <div class="title">
                {{ $t('sender') }}
              </div>
              <span class="multisig_property_fee">
                <SignerSelector v-model="formItems.multisigPublicKey" />
              </span>
            </div>

            <div class="multisig_property_amount">
              <span class="gray_content">
                <div class="title">{{ $t(formLabels[mode].approvalFieldName) }}</div>
                <div
                  class="title_describe"
                >{{ $t(formLabels[mode].approvalFieldDescription) }}</div>
                <div class="input_content">
                  <ErrorTooltip field-name="minApproval" placement-override="top">
                    <input
                      v-model="formItems.minApproval"
                      v-focus
                      v-validate="`integer|${validations.minApproval}`"
                      class="radius"
                      :data-vv-as="$t(formLabels[mode].approvalFieldName)"
                      data-vv-name="minApproval"
                    >
                  </ErrorTooltip>
                </div>
              </span>

              <span class="gray_content">
                <div class="title">{{ $t(formLabels[mode].removalFieldName) }}</div>
                <div class="title_describe">{{ $t(formLabels[mode].removalFieldDescription) }}</div>
                <div class="input_content">
                  <ErrorTooltip field-name="minRemoval" placement-override="top">
                    <input
                      v-model="formItems.minRemoval"
                      v-validate="`integer|${validations.minRemoval}`"
                      class="radius"
                      :data-vv-as="$t(formLabels[mode].removalFieldName)"
                      data-vv-name="minRemoval"
                    >
                  </ErrorTooltip>
                </div>
              </span>
            </div>

            <div class="multisig_add gray_content">
              <div class="title title-padding">
                {{ $t('Add_cosigners') }}
              </div>
              <div class="input_content">
                <ErrorTooltip field-name="cosigner" placement-override="top">
                  <input
                    v-model="cosignerToAdd"
                    v-focus
                    v-validate="'addressOrPublicKey'"
                    data-vv-name="cosigner"
                    :data-vv-as="$t('cosigner')"
                    :placeholder="$t('Address_or_public_key')"
                    type="text"
                  >
                </ErrorTooltip>
                <span class="add_button radius pointer" @click="addCosigner(AddOrRemove.ADD)">+</span>
                <span
                  v-if="mode === MULTISIG_FORM_MODES.MODIFICATION"
                  class="delete_button radius pointer"
                  @click="addCosigner(AddOrRemove.REMOVE)"
                >-</span>
              </div>
            </div>

            <div class="cosigner_list">
              <div class="head_title">
                {{ $t('Actions_list') }}
              </div>
              <ErrorTooltip
                field-name="cosigners"
                placement-override="top"
                style="width: 720px; text-align:center"
              >
                <div class="list_container radius scroll">
                  <div class="list_head">
                    <span class="address_alias">{{ $t('Address') }}</span>
                    <span class="action">{{ $t('operation') }}</span>
                    <span class="delete">&nbsp;</span>
                  </div>

                  <div class="list_body scroll">
                    <div
                      v-if="!cosignatoryModifications.modifications.length"
                      class="please_add_address"
                    >
                      {{ $t('The_action_list_is_empty') }}
                    </div>

                    <div
                      v-for="({addOrRemove, cosignatory}, index) in cosignatoryModifications.modifications"
                      :key="index"
                      class="list_item radius"
                    >
                      <span class="address_alias">{{ cosignatory.address.pretty() }}</span>
                      <span
                        class="action"
                      >{{ $t(`${addOrRemove}`) }}</span>
                      <img
                        class="delete pointer"
                        src="@/common/img/service/multisig/multisigDelete.png"
                        alt
                        @click="removeCosigner(index)"
                      >
                    </div>
                  </div>
                  <input
                    v-show="false"
                    v-model="cosignatoryModifications.modifications.length"
                    v-validate="validations.cosigners"
                    data-vv-name="cosigners"
                    :data-vv-as="$t('cosigners')"
                  >
                </div>
              </ErrorTooltip>
              <div class="multisig_property_fee">
                <div class="title">
                  {{ $t('fee') }}
                </div>
                <Select
                  v-model="formItems.feeSpeed"
                  v-validate="'required'"
                  data-vv-name="fee"
                  class="select"
                  :data-vv-as="$t('fee')"
                  :placeholder="$t('fee')"
                >
                  <Option
                    v-for="item in defaultFees"
                    :key="item.speed"
                    :value="item.speed"
                  >
                    {{ $t(item.speed) }} {{ `(${item.value} ${networkCurrency.ticker})` }}
                  </Option>
                </Select>
              </div>
            </div>

            <div class="confirm_button pointer" @click="submit">
              {{ $t('send') }}
            </div>
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
import { MultisigAccountModificationTs } from '@/components/forms/multisig-account-modification/MultisigAccountModificationTs.ts'
import './MultisigAccountModification.less'
export default class MultisigAccountModification extends MultisigAccountModificationTs {}
</script>
