<!--
  - Copyright 2020 NEM Foundation (https://nem.io)
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and limitations under the License.
  -
  -->

<template>
  <span>
    <MosaicAmountDisplay v-show="!isLoading" :color="'red'" :absolute-amount="amount" :show-ticker="true" />
    <span v-show="!isLoading && isMaxFee"> ({{ $t('max_fee') }})</span>
    <Spin v-if="isLoading" v-show="isLoading" class="inline-spin" size="small"></Spin>
  </span>
</template>

<script lang="ts">
import { PaidFeeDisplayTs } from './PaidFeeDisplayTs'

export default class PaidFeeDisplay extends PaidFeeDisplayTs {}
</script>
<style lang="less" scoped>
.inline-spin {
  display: inline-block !important;
}
.inline-spin .ivu-spin-main {
  display: inline-block !important;
}
.inline-spin .ivu-spin-dot {
  display: inline-block !important;
  margin: auto;
}
</style>
