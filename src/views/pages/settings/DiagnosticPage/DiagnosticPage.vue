<template>
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
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {NetworkType} from 'nem2-sdk'
import {mapGetters} from 'vuex'

// child components
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
import FormLabel from '@/components/FormLabel/FormLabel.vue'

// configuration
import appConfig from '@/../config/app.conf.json'
import feesConfig from '@/../config/fees.conf.json'
import networkConfig from '@/../config/network.conf.json'
import packageConfig from '@/../package.json'

@Component({
  components: {
    FormWrapper,
    FormLabel,
  },
  computed: {...mapGetters({
    logs: 'diagnostic/logs',
    infos: 'diagnostic/infos',
    debugs: 'diagnostic/debugs',
    warnings: 'diagnostic/warnings',
    errors: 'diagnostic/errors',
  })}
})
export default class DiagnosticPage extends Vue {
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

