<template>
  <FormWrapper class="account-unlock-container">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        onsubmit="event.preventDefault()"
        @keyup.enter="disableSubmit ? '' : handleSubmit(onSubmit)"
      >
        <!-- Form for UNLINK alias action -->
        <div v-if="aliasAction === AliasAction.Unlink">
          <span>
            {{ $t('unlink_namespace_from', {
              aliasTarget: formItems.aliasTarget, namespaceId: formItems.namespaceHexId,
            }) }}
          </span>
        </div>

        <!-- Form for LINK alias action -->
        <div v-if="aliasAction === AliasAction.Link">
          wwww{{formItems.namespaceHexId}}wwwwwwwwww
          <NamespaceSelector
            v-model="formItems.namespaceHexId"
            :namespaces="linkableNamespaces"
          />
          dddddddddd{{formItems.aliasTarget}}dddddddd
          <MosaicSelector
            v-if="aliasTargetType === 'mosaic'"
            v-model="formItems.aliasTarget"
            :mosaics="linkableMosaics"
          />
          iiiiiiiiiiii
          <!-- Transfer recipient input field -->
          <RecipientInput v-if="aliasTargetType === 'address'" v-model="formItems.aliasTarget" />
        </div>

        <!-- Transaction fee selector -->
        <MaxFeeSelector v-model="formItems.maxFee" />

        <button
          type="submit"
          class="centered-button button-style validation-button"
          @click="handleSubmit(onSubmit)"
        >
          {{ $t('send') }}
        </button>
      </form>
    </ValidationObserver>
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
</style>
