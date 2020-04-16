<template>
  <div class="window_controller">
    <div>
      <span class="pointer" @click="electronHelpers.minWindow" />
      <span v-if="electronHelpers.isMaximized" class="pointer not_window_max " @click="electronHelpers.maxWindow" />
      <span v-else class="pointer now_window_max" @click="electronHelpers.unMaximize" />
      <span class="pointer close_window" @click="electronHelpers.closeWindow" />
    </div>
  </div>
</template>

<script lang="ts">
import {WindowControlsTs} from './WindowControlsTs'
import './WindowControls.less'

export default class WindowControls extends WindowControlsTs {}
</script>
