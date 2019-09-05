<template>
  <div class="aliasTable">
    <Modal :title="aliasListIndex >= 0?$t('unbind'): $t('binding_alias')"
           v-model="isShowDialog"
           :transfer="false"
           @on-cancel="closeModel"
           class="alias_bind_dialog">

      <div class="input_content">
        <div class="title">{{$t('address')}}</div>
        <div class="input_area">
          <p v-if="aliasListIndex >= 0" class="unLinkP">{{formItem.address}}</p>
          <input type="text" v-model="formItem.address" v-else>
        </div>
      </div>

      <div class="input_content">
        <div class="title">{{$t('alias')}}</div>
        <div class="input_area">
          {{formItem.alias}}
        </div>
      </div>

      <div class="input_content">
        <div class="title">{{$t('fee')}}</div>
        <div class="input_area">
          <input type="text" v-model="formItem.fee" :placeholder="$t('alias_selection')">
          <span class="tip">XEM</span>
        </div>
      </div>

      <div class="input_content">
        <div class="title">{{$t('password')}}</div>
        <div class="input_area">
          <input type="password" v-model="formItem.password" :placeholder="$t('please_enter_your_wallet_password')">
        </div>
      </div>

      <div class="button_content">
        <span class="cancel pointer" @click="closeModel">{{$t('canel')}}</span>
        <span :class="['cancel', 'checkBtn', isCompleteForm?'pointer':'not_allowed']" @click="submit()">{{aliasListIndex >= 0?$t('unbind'):$t('bind')}}</span>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import {NamespaceAddressAliasDialogTs} from '@/views/service/namespace/namespace-function/namespace-list/namespace-address-alias-dialog/NamespaceAddressAliasDialogTs.ts'

    export default class NamespaceAddressAliasDialog extends NamespaceAddressAliasDialogTs {

    }
</script>
<style lang="less">
  @import "NamespaceAddressAliasDialog.less";
</style>
