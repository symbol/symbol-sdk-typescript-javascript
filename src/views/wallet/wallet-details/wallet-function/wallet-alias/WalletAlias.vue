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
          <p v-if="aliasListIndex >= 0" class="unLinkP">{{formItem.alias}}</p>
          <i-select v-model="formItem.alias" v-else :placeholder="$t('alias_selection')">
            <i-option v-for="(item,index) in aliasActionTypeList" :key="index" :value="item.value">
              {{ item.label }}
            </i-option>
          </i-select>
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
        <span :class="['cancel', 'checkBtn', isCompleteForm?'pointer':'not_allowed']" @click="checkAliasForm()">{{aliasListIndex >= 0?$t('unbind'):$t('bind')}}</span>
      </div>
    </Modal>

    <div class="tableTit">
      <Row>
        <Col span="4">{{$t('namespace')}}</Col>
        <Col span="12">{{$t('address')}}</Col>
        <Col span="3">{{$t('validity_period')}}</Col>
        <Col span="4">
          <span class="right alias_delete pointer" @click="isShowDeleteIcon = !isShowDeleteIcon"></span>
          <span class=" right alias_add pointer" @click="isShowDialog=true"></span>
        </Col>

      </Row>
    </div>
    <div class="table_body">
      <div class="tableCell" v-for="(item,index) in aliasList" :key="index" v-if="aliasList.length>0">
        <Row>
          <Col span="4">{{item.name}}</Col>
          <Col span="12">{{formatAddress(item.alias.address)}}</Col>
          <Col span="5">{{computeDuration(item.duration) === 'Expired' ? $t('overdue') : computeDuration(item.duration)}}</Col>
          <Col span="3">
            <span v-show="isShowDeleteIcon"
                  @click="showUnLink(index)"
                  class="delete_icon pointer"></span>
          </Col>
        </Row>
      </div>
    </div>

    <div class="noData" v-if="aliasList.length<=0">
      <i><img src="@/common/img/wallet/no_data.png"></i>
      <p>{{$t('not_yet_open')}}</p>
    </div>
  </div>
</template>

<script lang="ts">
    import {WalletAliasTs} from './WalletAliasTs'

    export default class WalletAlias extends WalletAliasTs {

    }
</script>
<style  lang="less">
  @import "WalletAlias.less";
</style>
