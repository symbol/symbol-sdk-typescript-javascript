<template>
  <div>
    <Modal
      v-if="show"
      v-model="show"
      class-name="vertical-center-modal text_select"
      :footer-hide="true"
      :transfer="false"
    >
      <div class="title">
        {{ $t('Debug_console') }}
      </div>
      <div v-if="!$store.state.app.logs.length" class="separator">
        {{ $t('no_data') }}
      </div>
      <div
        v-for="(log, index) in $store.state.app.logs"
        :key="index"
      >
        <div class="log-container">
          <div class="log-field-title">
            {{ $t('from') }}
          </div>
          <div>{{ log.from }}</div>
          <div class="log-field-title">
            {{ $t('timestamp') }}
          </div>
          <div>{{ log.date }}</div>
          <div class="log-field-title">
            {{ $t('Data') }}
          </div>
          <div>{{ JSON.parse(log.data) }}</div>
        </div>
        <div
          v-if="index < $store.state.app.logs.length - 1"
          class="separator"
        >
          <hr>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import {DebugConsoleTs} from './DebugConsoleTs'
import "./DebugConsole.less";

export default class DebugConsole extends DebugConsoleTs { }
</script>
