<template>
  <div class="harvesting-options-container">
    <div class="single-harvesting-option">
      <div class="harvesting-explain">
        <span class="subtitle">{{ $t('wallets_harvesting_title_remote') }}</span>
        <p>{{ $t('wallets_harvesting_remote_explain_p1') }}</p>
        <p>{{ $t('wallets_harvesting_remote_explain_p2') }}</p>
      </div>
      <div class="harvesting-options">
        <div class="harvesting-item">
          <div class="img-box radius">
            <img src="@/views/resources/img/symbol/Link.png">
          </div>
          <p class="access-name">
            {{ $t('wallets_harvesting_tile_remote') }}
          </p>
          <p class="access-info">
            {{ $t('wallets_harvesting_tile_remote_description') }}
          </p>
        </div>
      </div>
    </div>
    <div class="single-harvesting-option">
      <div class="harvesting-explain">
        <span class="subtitle">{{ $t('wallets_harvesting_title_request') }}</span>
        <p>{{ $t('wallets_harvesting_request_explain_p1') }}</p>
        <p>{{ $t('wallets_harvesting_request_explain_p2') }}</p>
      </div>
      <div class="harvesting-options">
        <div class="harvesting-item">
          <div class="img-box radius">
            <img src="@/views/resources/img/symbol/DelegatedHarvesting.png">
          </div>
          <p class="access-name">
            {{ $t('wallets_harvesting_tile_request') }}
          </p>
          <p class="access-info">
            {{ $t('wallets_harvesting_tile_request_description') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletActionsTs} from './WalletActionsTs'
import './WalletActions.less'

export default class WalletActions extends WalletActionsTs {}
</script>
