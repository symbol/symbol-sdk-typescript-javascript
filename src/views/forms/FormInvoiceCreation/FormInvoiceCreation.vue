<template>
<div>
  <div class="set-qr-image">
    {{ $t('set_qr_image') }}
  </div>

  <FormTransferCreation :recipient="currentWallet.objects.address"
                        :disable-submit="true"
                        @input="onFormChange" />
</div>
</template>

<script lang="ts">
import {FormInvoiceCreationTs} from './FormInvoiceCreationTs'
import './FormInvoiceCreation.less'

export default class FormInvoiceCreation extends FormInvoiceCreationTs {}
</script>
