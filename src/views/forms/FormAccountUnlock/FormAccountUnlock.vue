<template>
  <form action="processSubmit" onsubmit="event.preventDefault()" @keyup.enter="processVerification">
    <input v-model.lazy="password" type="password" required
        :placeholder="$t('please_enter_your_wallet_password')" />

    <button class="radius" type="success" @click="processVerification">
      {{ $t('confirm') }}
    </button>
  </form>
</template>

<script lang="ts">
import {FormAccountUnlockTs} from './FormAccountUnlockTs'
import './FormAccountUnlock.less'

export default class FormAccountUnlock extends FormAccountUnlockTs {}
</script>
