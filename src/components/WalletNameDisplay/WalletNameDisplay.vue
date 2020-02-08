<template>
  <div>
    <span class="wallet-detail-label">{{ $t('Wallet_name') }}</span>
    <span v-if="wallet" class="walletName">{{ wallet.values.get('name') }}</span>
    <span v-if="editable"
          @click.stop="hasNameFormModal = true"
          class="edit-wallet-name" >
      <Icon type="md-create"/>
    </span>

    <ModalFormGeneric 
      v-if="hasNameFormModal"
      :visible="hasNameFormModal"
      @submit="onChangeName"
      @close="hasNameFormModal = false">
      <template v-slot:fields="slotProps">
        <ValidationProvider
          class="full-width-item-container"
          tag="div"
          mode="lazy"
          vid="name"
          :name="$t('name')"
          :rules="validationRules.accountWalletName"
          v-slot="{ errors }"
        >
          <div class="row">
            <FormLabel>{{ $t('form_label_new_wallet_name') }}</FormLabel>
            <ErrorTooltip :errors="errors">
              <input type="text"
                    name="name"
                    class="full-width-item-container input-size input-style"
                    v-model="slotProps.formItems.name" />
            </ErrorTooltip>
          </div>
        </ValidationProvider>
      </template>
    </ModalFormGeneric>
  </div>
</template>

<script lang="ts">
import {WalletNameDisplayTs} from './WalletNameDisplayTs'
import '@/styles/forms.less'

export default class WalletNameDisplay extends WalletNameDisplayTs {}
</script>

<style lang="less" scoped>
@import '../WalletDetails/WalletDetails.less';
</style>
