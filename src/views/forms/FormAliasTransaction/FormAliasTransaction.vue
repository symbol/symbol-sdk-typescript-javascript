<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        onsubmit="event.preventDefault()"
        class="form-container"
        @keyup.enter="disableSubmit ? '' : handleSubmit(onSubmit)"
      >
        <!-- UNLINK alias action -->
        <div v-if="aliasAction === AliasAction.Unlink">
          <span>
            {{ $t('unlink_namespace_from', {
              aliasTarget: formItems.aliasTarget, namespaceName: namespaceId.fullName,
            }) }}
          </span>
        </div>

        <!-- LINK alias action -->
        <div v-else>
          <div class="form-row">
            <ValidationProvider
              :name="$t('registrationType')"
              :rules="'required'"
              tag="div"
              mode="lazy"
              vid="registrationType"
            >
              <FormLabel>{{ $t('form_label_alias_type') }}</FormLabel>
              <select
                v-model="aliasTargetType"
                class="input-size input-style"
                @change="formItems.aliasTarget = ''"
              >
                <option value="mosaic">
                  {{ $t('option_link_mosaic') }}
                </option>
                <option value="address">
                  {{ $t('option_link_address') }}
                </option>
              </select>
            </ValidationProvider>
          </div>

          <!-- Form for LINK alias action -->
          <div v-if="aliasAction === AliasAction.Link">
            <NamespaceSelector
              v-model="formItems.namespaceFullName"
              label="form_label_choose_namespace"
              :namespaces="linkableNamespaces"
            />
            <MosaicSelector
              v-if="aliasTargetType === 'mosaic'"
              v-model="formItems.aliasTarget"
              :mosaics="linkableMosaics"
              label="form_label_link_mosaic"
            />
            <!-- Transfer recipient input field -->
            <AddressInput
              v-if="aliasTargetType === 'address'"
              v-model="formItems.aliasTarget"
              label="form_label_link_address"
            />
          </div>
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
