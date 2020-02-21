<template>
  <div class="container">
    <Modal v-model="show" :title="`${$t(title)}`" :transfer="true" class-name="modal-form-wrap-container">
      <div class="diagnostic-container text_select">
        <div class="form-container">
          <pre class="logger">
              <span v-for="(entry, index) in logs"
              :key="index"
              :class="{
                  'normal': entry.level === 1 || entry.level === 2,
                  'warning': entry.level === 3,
                  'error': entry.level === 4,
              }">{{ '\n' }} ({{ getTime(entry) }}) [{{ getLevel(entry) }}] {{ entry.message }}</span>
          </pre>
        </div>
    </div>
    </Modal>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {...mapGetters({
    logs: 'diagnostic/logs',
    infos: 'diagnostic/infos',
    debugs: 'diagnostic/debugs',
    warnings: 'diagnostic/warnings',
    errors: 'diagnostic/errors',
  })}
})
export default class ModalDebugConsole extends Vue {
  /**
   * Modal title
   * @type {string}
   */
  @Prop({ default: '' }) title: string
  
  /**
   * Modal visibility state from parent
   * @type {string}
   */
  @Prop({ default: false }) visible: boolean

  /**
   * Internal visibility state
   * @type {boolean}
   */
  public get show(): boolean {
    return this.visible
  }

  /**
   * Emits close event
   */
  public set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }

  public getLevel(entry): string {
    return entry.level === 1
         ? 'INFO' : (entry.level === 2
         ? 'DEBUG': (entry.level === 3
         ? 'WARNING': 'ERROR')) 
  }

  public getTime(entry): string {
    return entry.time.toLocaleString()
  }
}
</script>

<style lang="less" scoped>
.ivu-modal-content {
  width: 8.5rem;
}

.diagnostic-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;

  pre.logger {
    max-width: 1000px;
    max-height: 600px;
    overflow: auto;

    .normal { color: #000000; }
    .warning { color: #ffa500; }
    .error { color: #ff0000; }
  }
}
</style>
