<template>
  <div>
    <span class="tit">{{ $t('Wallet_name') }}</span>
    <span v-if="wallet" class="walletName">{{ wallet.values.get('name') }}</span>
    <span v-if="editable"
          @click.stop="hasNameFormModal = true"
          class="edit-wallet-name" >
      <Icon type="md-create"/>
    </span>

    <ModalFormGeneric :visible="hasNameFormModal"
                      @submit="onChangeName"
                      @cancel="hasNameFormModal = false">
      <div v-slot:fields="formItems">
        <div class="row">
          <label>New name: </label>
          <input type="text" name="name" v-model="formItems.name" />
        </div>
      </div>
    </ModalFormGeneric>
  </div>
</template>

<script lang="ts">
import {WalletNameDisplayTs} from './WalletNameDisplayTs'

export default class WalletNameDisplay extends WalletNameDisplayTs {}
</script>
