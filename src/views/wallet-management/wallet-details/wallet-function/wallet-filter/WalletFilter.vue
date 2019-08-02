<template>
  <div class="filterTable">

    <Modal
            :title="$t(currentTitle)"
            v-model="isShowDialog"
            :transfer="true"
            class-name="alias_bind_dialog filter_dialog">

      <!--      address-->
      <div class="address_dialog" v-if="filterTypeList[0]">
        <div class="input_content">
          <div class="title">{{$t('address')}}</div>
          <div class="input_area"><input type="text" value="TCTEXC-5TGXD7-OQCHBB-MNU3LSTCTEXC-5TGXD7-OQCHBB-MNU3LS">
          </div>
        </div>
        <div class="input_content">
          <div class="title">{{$t('fee')}}</div>
          <div class="input_area">
            <input type="text" :placeholder="$t('alias_selection')">
            <span class="tip">XEM</span>
          </div>
        </div>
        <div class="input_content">
          <div class="title">{{$t('password')}}</div>
          <div class="input_area"><input type="password" :placeholder="$t('please_enter_your_wallet_password')"></div>
        </div>
      </div>

      <!--      mosaic-->

      <div class="address_dialog" v-if="filterTypeList[1]">
        <div class="input_content">
          <div class="title">{{$t('mosaic')}}</div>
          <div class="input_area"><input type="text" value="2145d5sd4da231f">
          </div>
        </div>
        <div class="input_content">
          <div class="title">{{$t('fee')}}</div>
          <div class="input_area">
            <input type="text" :placeholder="$t('alias_selection')">
            <span class="tip">XEM</span>
          </div>
        </div>
        <div class="input_content">
          <div class="title">{{$t('password')}}</div>
          <div class="input_area"><input type="password" :placeholder="$t('please_enter_your_wallet_password')"></div>
        </div>
      </div>

      <!-- entity type-->
      <div class="address_dialog" v-if="filterTypeList[2]">
        <div class="input_content">
          <div class="title">{{$t('transaction_type')}}</div>
          <div class="input_area"><input type="text" value="transfer transaction">
          </div>
        </div>
        <div class="input_content">
          <div class="title">{{$t('fee')}}</div>
          <div class="input_area">
            <input type="text" :placeholder="$t('alias_selection')">
            <span class="tip">XEM</span>
          </div>
        </div>
        <div class="input_content">
          <div class="title">{{$t('password')}}</div>
          <div class="input_area"><input type="password" :placeholder="$t('please_enter_your_wallet_password')"></div>
        </div>
      </div>

      <div class="button_content">
        <span class="cancel pointer" @click="isShowDialog=false">{{$t('canel')}}</span>
        <span class="bind pointer" @click="isShowDialog=false">{{$t('bind')}}</span>
      </div>
    </Modal>

    <div class="tableTit">
      <Row>
        <Col span="3">
          <span :class="[filterTypeList[0]?'active':'','pointer','filter_type_title']"
                @click="showFilterTypeListIndex(0)">{{$t('address')}}</span>
        </Col>
        <Col span="3">
          <span :class="[filterTypeList[1]?'active':'','pointer','filter_type_title']"
                @click="showFilterTypeListIndex(1)">{{$t('mosaic')}}</span>
        </Col>
        <Col span="3">
          <span :class="[filterTypeList[2]?'active':'','pointer','filter_type_title']"
                @click="showFilterTypeListIndex(2)">{{$t('transaction_type')}}</span>
        </Col>
        <Col span="14">
          <span class="right alias_delete pointer" @click="isShowDeleteIcon=true"></span>
          <span class="right alias_add pointer" @click="isShowDialog=true"></span>
        </Col>
      </Row>
    </div>
    <div class="table_body">

      <div class="address_list" v-if="filterTypeList[0]">
        <div class="tableCell" v-for="(item,index) in aliasList" :key="index" v-if="aliasList.length>0">
          <Row>
            <Col span="21">TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN</Col>
            <Col span="1"><span v-show="isShowDeleteIcon" class="delete_icon pointer"></span></Col>
          </Row>
        </div>
      </div>

      <div class="mosaic_list" v-if="filterTypeList[1]">
        <div class="tableCell" v-for="(item,index) in aliasList" :key="index" v-if="aliasList.length>0">
          <Row>
            <Col span="21">77a1969932d987d7</Col>
            <Col span="1"><span v-show="isShowDeleteIcon" class="delete_icon pointer"></span></Col>
          </Row>
        </div>
      </div>

      <div class="entity_type_list" v-if="filterTypeList[2]">
<!--        <div class="tableCell">-->
<!--          <Row>-->
<!--            <Col span="21"></Col>-->
<!--            <Col span="1"><span v-show="isShowDeleteIcon" class="delete_icon pointer"></span></Col>-->
<!--          </Row>-->
<!--        </div>-->

      </div>
    </div>

    <div class="noData" v-if="aliasList.length<=0">
      <i><img src="@/assets/images/wallet-management/no_data.png"></i>
      <p>{{$t('not_yet_open')}}</p>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class WalletFilter extends Vue {
        aliasList = []
        filterTypeList = [true, false, false]
        isShowDeleteIcon = false
        isShowDialog = false
        currentAlias: any = false
        currentTitle = 'add_address'
        titleList = ['add_address', 'add_mosaic', 'add_entity_type']
        namespaceList = [
            {
                label: 'no data',
                value: 'no data'
            }
        ]

        showFilterTypeListIndex(index) {
            console.log(index)
            this.currentTitle = this.titleList[index]
            this.filterTypeList = [false, false, false]
            this.filterTypeList[index] = true
        }
    }
</script>
<style scoped lang="less">
  @import "WalletFilter.less";
</style>
