<template>
  <div class="import-way-wrapper radius">
    <div class="import-way-inner-panel">
      <div class="welcome-head">
        <p class="title">
          {{ $t('access_my_profile') }}
        </p>
        <p class="title-tips">
          {{ $t('existing_profile') }}
          <span class="create-profile" @click="$router.push({ name: 'profiles.login' })">
            {{ $t('go_to_login') }}
          </span>
        </p>
      </div>
      <div class="profile-type">
        <div v-for="(item, index) in importInfoList" :key="index" class="profile-item" @click="redirect(item.route)">
          <div class="img-box radius">
            <img :src="item.image" />
          </div>
          <p class="access-name">
            {{ $t(item.title) }}
          </p>
          <p class="access-info">
            {{ $t(item.description) }}
          </p>
        </div>
      </div>
      <div class="bottom-text">{{ $t('more_access_tool_is_working') }}...</div>
    </div>
  </div>
</template>

<script lang="ts">
import ImportStrategyTs from './ImportStrategyTs'
export default class ImportStrategy extends ImportStrategyTs {}
</script>
<style lang="less" scoped>
@import './ImportStrategy.less';
</style>
