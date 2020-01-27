<template>
  <span
    class="col2-item overflow_ellipsis"
  >
    {{ this.pretty }}
  </span>
</template>

<script lang="ts">
import {AddressDisplayTs} from './AddressDisplayTs'

export default class AddressDisplay extends AddressDisplayTs {}
</script>
