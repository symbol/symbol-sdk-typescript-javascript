<template>
  <div>
    <FormWrapper>
      <ExplorerUrlSetter />
    </FormWrapper>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

// child components
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import ExplorerUrlSetter from '@/components/ExlorerUrlSetter/ExplorerUrlSetter.vue'

@Component({
  components: {
    FormWrapper,
    ExplorerUrlSetter,
  },
})
export default class GeneralSettings extends Vue {}
</script>
