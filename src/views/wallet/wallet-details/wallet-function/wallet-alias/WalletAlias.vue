<template>
  <div class="aliasTable">
    <Modal :title="aliasListIndex >= 0?$t('unbind'): $t('Add_to_local_address_book')"
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
        <div class="title">{{$t('tag')}}</div>
        <div class="input_area">
          <input v-model="formItem.tag" :placeholder="$t('tag')">
        </div>
      </div>

      <div class="input_content">
        <div class="title">{{$t('alias')}}</div>
        <div class="input_area">
          <input v-model="formItem.alias" :placeholder="$t('address_alias')">
        </div>
      </div>

      <div class="button_content">
        <span class="cancel pointer" @click="closeModel">{{$t('cancel')}}</span>
        <span :class="['cancel', 'checkBtn', isCompleteForm?'pointer':'not_allowed']" @click="submit()">{{aliasListIndex >= 0?$t('unbind'):$t('add')}}</span>
      </div>
    </Modal>

    <div class="tableTit">
      <Row>
        <Col span="4">{{$t('tag')}}</Col>
        <Col span="12">{{$t('address')}}({{$t('alias')}})</Col>
        <Col span="4">
          <!--          <span class="right alias_delete pointer" @click="isShowDeleteIcon = !isShowDeleteIcon"></span>-->
          <span class=" right icon_add pointer" @click="isShowDialog=true"></span>
        </Col>

      </Row>
    </div>
    <div class="table_body">
      <div class="tableCell"
           v-for="(item,index) in aliasList.slice((currentPage-1)*pageSize,(currentPage)*pageSize)"
           :key="index"
           v-if="aliasList.length>0">
        <Row>
          <Col span="4">{{item.tag}}</Col>
          <Col span="12">{{item.address}}
            <span class="alias_name">(<span class="green">{{item.alias}}</span>)</span>
          </Col>

          <Col span="3">
            <span
                    @click="removeLink(item)"
                    class="delete_icon pointer"></span>
          </Col>
        </Row>
      </div>
      <div class="page_list_container">
        <Page :total="aliasList.length" :page-size="pageSize" @on-change="handleChange"></Page>
      </div>
    </div>

    <div class="noData" v-if="aliasList.length<=0">
      <p>{{$t('no_data')}}</p>
    </div>
  </div>
</template>

<script lang="ts">
    //@ts-ignore
    import {WalletAliasTs} from '@/views/wallet/wallet-details/wallet-function/wallet-alias/WalletAliasTs.ts'
    import "./WalletAlias.less"

    export default class WalletAlias extends WalletAliasTs {

    }
</script>
<style lang="less">

</style>
