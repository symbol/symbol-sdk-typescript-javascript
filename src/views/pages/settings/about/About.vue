<template>
  <div>
    <FormWrapper />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

// child components
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
import FormLabel from '@/components/FormLabel/FormLabel.vue'

@Component({
  components: {
    FormWrapper,
    FormLabel,
  },
})
export default class About extends Vue {}
</script>
