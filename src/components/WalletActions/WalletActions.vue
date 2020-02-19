<template>
  <div class="account-type">
    <div class="account-item">
      <div class="img-box radius"><img src="@/views/resources/img/symbol/DelegatedHarvesting.png"></div>
      <p class="access-name">{{ $t('wallets_setup_harvesting_title') }}</p>
      <p class="access-info">{{ $t('wallets_setup_harvesting_description') }}</p>
    </div>
    <div class="account-item danger">
      <div class="img-box radius"><img src="@/views/resources/img/symbol/Lock.png"></div>
      <p class="access-name">{{ $t('wallets_change_password_title') }}</p>
      <p class="access-info">{{ $t('wallets_change_password_description') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletActionsTs} from './WalletActionsTs'
import './WalletActions.less'

export default class WalletActions extends WalletActionsTs {}
</script>
