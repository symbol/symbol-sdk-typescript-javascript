<template>
  <div class="account-detail-row">
    <div class="label">
      {{ $t('account_name') }}
    </div>
    <div class="value">
      <span v-if="account" class="accountName">{{ account.name }}</span>
      <button
        type="button"
        class="button-style validation-button right-side-button edit-button"
        @click.stop="hasNameFormModal = true"
      >
        <Icon type="md-create" />
      </button>
    </div>

    <ModalFormAccountNameUpdate v-if="hasNameFormModal" :visible="hasNameFormModal" @close="hasNameFormModal = false" />
  </div>
</template>

<script lang="ts">
import { AccountNameDisplayTs } from './AccountNameDisplayTs'

export default class AccountNameDisplay extends AccountNameDisplayTs {}
</script>

<style lang="less" scoped>
.edit-button {
  height: 0.35rem !important;
  padding: 0 0.3rem;
}
</style>
