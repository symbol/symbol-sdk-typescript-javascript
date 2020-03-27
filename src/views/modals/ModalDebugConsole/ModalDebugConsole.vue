<template>
  <div class="debug-console-wrapper">
    <Modal v-model="show" :title="`${$t(title)}`" :transfer="false">
      <div class="diagnostic-container">
        <div class="form-container">
          <pre id="logs-container" class="logger">
              <span
v-for="(entry, index) in logs"
              :key="index"
              :class="{
                  'normal': entry.level === 1 || entry.level === 2,
                  'warning': entry.level === 3,
                  'error': entry.level === 4,
              }"
>{{ '\n' }} ({{ getTime(entry) }}) [{{ getLevel(entry) }}] {{ entry.message }}</span>
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

// resources
import './ModalDebugConsole.less'

@Component({
  computed: {...mapGetters({
    logs: 'diagnostic/logs',
  })},
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
        ? 'DEBUG' : (entry.level === 3
          ? 'WARNING' : 'ERROR')) 
  }

  public getTime(entry): string {
    return entry.time.toLocaleString()
  }

  /**
   * Hook called when component is mounted
   */
  mounted() {
    // Scrolls logs div to bottom
    Vue.nextTick().then(() =>{
      const container = this.$el.querySelector('#logs-container')
      container.scrollTop = container.scrollHeight
    })
  }
}
</script>
