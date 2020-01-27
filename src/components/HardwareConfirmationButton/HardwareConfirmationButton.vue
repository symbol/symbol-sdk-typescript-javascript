<template>
  <Button type="success" @click="processHardware">
    {{ $t('trezor_confirm_transaction_prompt') }}
  </Button>
</template>

<script lang="ts">
import {HardwareConfirmationButtonTs} from '@/components/transaction-confirmation/HardwareConfirmationButtonTs.ts'
import './HardwareConfirmationButton.less'

export default class HardwareConfirmationButton extends HardwareConfirmationButtonTs {}
</script>
