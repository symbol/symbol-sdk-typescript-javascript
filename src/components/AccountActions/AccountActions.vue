<template>
  <div class="harvesting-options-container">
    <div class="single-harvesting-option">
      <div class="harvesting-explain">
        <span class="subtitle">{{ $t('accounts_harvesting_title_remote') }}</span>
        <p>{{ $t('accounts_harvesting_remote_explain_p1') }}</p>
        <p>{{ $t('accounts_harvesting_remote_explain_p2') }}</p>
      </div>
      <div class="harvesting-options">
        <div class="harvesting-item">
          <div class="img-box radius">
            <img src="@/views/resources/img/symbol/Link.png">
          </div>
          <p class="access-name">
            {{ $t('accounts_harvesting_tile_remote') }}
          </p>
          <p class="access-info">
            {{ $t('accounts_harvesting_tile_remote_description') }}
          </p>
        </div>
      </div>
    </div>
    <div class="single-harvesting-option">
      <div class="harvesting-explain">
        <span class="subtitle">{{ $t('accounts_harvesting_title_request') }}</span>
        <p>{{ $t('accounts_harvesting_request_explain_p1') }}</p>
        <p>{{ $t('accounts_harvesting_request_explain_p2') }}</p>
      </div>
      <div class="harvesting-options">
        <div class="harvesting-item">
          <div class="img-box radius">
            <img src="@/views/resources/img/symbol/DelegatedHarvesting.png">
          </div>
          <p class="access-name">
            {{ $t('accounts_harvesting_tile_request') }}
          </p>
          <p class="access-info">
            {{ $t('accounts_harvesting_tile_request_description') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {AccountActionsTs} from './AccountActionsTs'
import './AccountActions.less'

export default class AccountActions extends AccountActionsTs {}
</script>
