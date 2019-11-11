<template>
  <div class="text_select">
    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="gray_input_content">
        <span class="title">{{$t('Node_URL')}}</span>
        <ErrorTooltip fieldName="nodeUrl">
          <input
            v-focus
            type="text"
            :placeholder="$t('Node_URL_Placeholder')"
            v-model="nodeUrl"
            v-validate="{
              required: true,
              url: {require_protocol: true, require_tld: false}
            }"
            :data-vv-as="$t('Node_URL')"
            data-vv-name="nodeUrl"
          />
        </ErrorTooltip>
      </div>

      <div class="gray_input_content">
        <span class="title">{{$t('Node_public_key')}}</span>
        <span class="type value radius flex_center">{{ nodePublicKey }}</span>
      </div>

      <div class="new_model_btn">
        <span class="modal_btn pointer radius" @click="submit">{{$t('search')}}</span>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { GetNodePublicKeyTs } from "./GetNodePublicKeyTs";
export default class GetNodePublicKey extends GetNodePublicKeyTs {}
</script>
<style lang="less">
@import "GetNodePublicKey.less";
</style> 
