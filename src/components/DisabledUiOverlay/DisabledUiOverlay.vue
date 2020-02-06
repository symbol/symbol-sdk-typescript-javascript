<template>
  <div class="disabledUiOverlay">
    <Modal
      v-if="show"
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :transfer="false"
      :closable="false"
      :mask-closable="false"
    >
      <div class="uiDisabledMessage">
        {{ $t(message) }}
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import {DisabledUiOverlayTs} from './DisabledUiOverlayTs'
import './DisabledUiOverlay.less'

export default class DisabledUiOverlay extends DisabledUiOverlayTs {}
</script>
