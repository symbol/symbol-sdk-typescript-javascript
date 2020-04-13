<template>
  <FormWrapper>
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
      <form
        onsubmit="event.preventDefault()"
        class="form-container"
      >
        <!-- UNLINK alias action -->
        <FormRow v-if="aliasAction === AliasAction.Unlink">
          <template v-slot:inputs>
            <div class="row-left-message">
              <span>
                {{ $t('unlink_namespace_from', {
                  aliasTarget: formItems.aliasTarget, namespaceName: namespaceId.fullName,
                }) }}
              </span>
            </div>
          </template>
        </FormRow>

        <!-- LINK alias action -->
        <div v-else>
          <FormRow>
            <template v-slot:label>
              {{ $t('form_label_alias_type') }}:
            </template>
            <template v-slot:inputs>
              <ValidationProvider
                :name="$t('registrationType')"
                :rules="'required'"
                mode="lazy"
                vid="registrationType"
                tag="div"
                class="inputs-container select-container"
              >
                <select
                  v-model="aliasTargetType"
                  class="select-size select-style"
                  @change="formItems.aliasTarget = ''"
                >
                  <option value="mosaic">
                    {{ $t('option_link_mosaic') }}
                  </option>
                  <option v-show="assetType === 'namespace'" value="address">
                    {{ $t('option_link_address') }}
                  </option>
                </select>
              </ValidationProvider>
            </template>
          </FormRow>

          <div v-if="aliasAction === AliasAction.Link">
            <NamespaceSelector
              v-model="formItems.namespaceFullName"
              label="form_label_choose_namespace"
              :namespaces="linkableNamespaces"
            />

            <FormRow v-if="aliasTargetType === 'mosaic'">
              <template v-slot:label>
                {{ $t('mosaic') }}:
              </template>
              <template v-slot:inputs>
                <MosaicSelector
                  v-model="formItems.aliasTarget"
                  :mosaics="linkableMosaics"
                  default-mosaic="firstInList"
                  label="form_label_link_mosaic"
                />
              </template>
            </FormRow>

            <!-- Transfer recipient input field -->
            <AddressInput
              v-if="aliasTargetType === 'address'"
              v-model="formItems.aliasTarget"
              label="form_label_link_address"
            />
          </div>
        </div>

        <MaxFeeAndSubmit
          v-model="formItems.maxFee"
          :disable-submit="disableSubmit"
          @button-clicked="disableSubmit ? '' : handleSubmit(onSubmit)"
        />
      </form>
    </ValidationObserver>
    <ModalTransactionConfirmation
      v-if="hasConfirmationModal"
      :visible="hasConfirmationModal"
      @success="onConfirmationSuccess"
      @error="onConfirmationError"
      @close="onConfirmationCancel"
    />
  </FormWrapper>
</template>

<script lang="ts">
import { FormAliasTransactionTs } from './FormAliasTransactionTs'
export default class FormAliasTransaction extends FormAliasTransactionTs {}
</script>

<style scoped>
.account-unlock-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
.row-left-message{
  padding-left: 0.1rem;
}
.select-container{
  padding-left: 0.1rem;
}
</style>
