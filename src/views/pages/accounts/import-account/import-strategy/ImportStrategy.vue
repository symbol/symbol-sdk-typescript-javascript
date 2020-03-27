<template>
  <div class="import-way-wrapper radius">
    <div class="import-way-inner-panel">
      <div class="welcome-head">
        <p class="title">
          {{ $t('Access_My_Account') }}
        </p>
        <p class="title-tips">
          {{ $t('Existing_Account') }}
          <span
            class="create-account"
            @click="$router.push({name:'accounts.login'})"
          >
            {{ $t('go_to_login') }}
          </span>
        </p>
      </div>
      <div class="account-type">
        <div
          v-for="(item,index) in importInfoList" :key="index" class="account-item"
          @click="redirect(item.route)"
        >
          <div class="img-box radius">
            <img :src="item.image">
          </div>
          <p class="access-name">
            {{ $t(item.title) }}
          </p>
          <p class="access-info">
            {{ $t(item.description) }}
          </p>
        </div>
      </div>
      <div class="bottom-text">
        {{ $t('More_Access_Tool_is_working') }}...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ImportStrategyTs from './ImportStrategyTs'
import './ImportStrategy.less'

export default class ImportStrategy extends ImportStrategyTs {}
</script>
