<template>
  <div class="aliasTable">
    <Modal :title="$t('binding_alias')" v-model="isShowDialog" :transfer="true" class="alias_bind_dialog">

      <div class="input_content">
        <div class="title">{{$t('address')}}</div>
        <div class="input_area"><input type="text" v-model="formItem.address"></div>
      </div>

      <div class="input_content">
        <div class="title">{{$t('alias_selection')}}</div>
        <div class="input_area">
          <i-select :model="formItem.alias" :placeholder="$t('alias_selection')">
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
        <span class="cancel pointer" @click="isShowDialog=false">{{$t('canel')}}</span>
        <span class="cancel un_click" @click="isShowDialog=true">{{$t('bind')}}</span>
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
          <Col span="4">girme</Col>
          <Col span="12">TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN</Col>
          <Col span="5">45{{$t('time_day')}}</Col>
          <Col span="3"><span v-show="isShowDeleteIcon" class="delete_icon pointer"></span></Col>

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
    import {Message} from "config/index"
    import {Component, Vue} from 'vue-property-decorator'

    @Component
    export default class WalletAlias extends Vue {
        isShowDialog = false
        isShowDeleteIcon = false
        formItem = {
            address: '',
            alias: '',
            fee: '',
            password: ''
        }
        aliasList = []
        aliasActionTypeList = [
            {
                label: 'no data',
                value: 'no data'
            }
        ]

        checkForm(): boolean {
            const {address, alias, fee, password} = this.formItem
            if (address.length < 40) {
                this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
                return false
            }
            if (alias || alias.trim()) {
                this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
                return false
            }
            if (password || password.trim()) {
                this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
                return false
            }
            if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
                this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
                return false
            }
            return true
        }

        showErrorMessage(message) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: message
            })
        }
    }
</script>
<style scoped lang="less">
  @import "WalletAlias.less";
</style>
