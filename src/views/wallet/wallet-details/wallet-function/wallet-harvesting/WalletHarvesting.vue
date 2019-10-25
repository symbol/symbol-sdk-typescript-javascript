<template>
  <div class="remote_board_container secondary_page_animate scroll">
    <div class="top_network_info radius scroll">
      <div class="remote_total">
<!--        <strong class="trend"> {{$t('Remote_title_receipt')}}</strong>-->
<!--        <div class="num_class">-->
<!--          <span class="trend_red"> {{$t('Accumulated_delegated_harvesting_income_is_not_yet_open')}}</span>-->
<!--        </div>-->
        <div class="state_class">
          <div class="div_cer">
            <span class="remote_public_key">{{$t('Remote_state')}}：</span>
            <span>{{isLinked?'Linked':'Unlink'}}</span>
            <!--            <i-switch v-model="isLinked" @on-change="toggleSwitch"/>-->
            <button :class="[isLinked?'toggle_link_button_to_unlink':'toggle_link_button_to_link','pointer']"
                    @click="toggleSwitch">
              {{isLinked?$t('Unlink_now'):$t('Link_now')}}
            </button>

          </div>
          <div class="top_class_div">
            <span class="remote_public_key">{{$t('Remote_public_key')}}：</span>
            <span class="text_select">{{linkedAccountKey?linkedAccountKey:'no remote account'}}</span>
          </div>
        </div>
      </div>
      <div class="question_class">
        <div>
          <div class="wid_bord_class">
            <span class="bord_class">{{$t('what_is_delegated_harvesting')}}</span>
          </div>
          <div class="content_des">
            <p class="content_font">{{$t('Delegated_harvesting_text_1')}}</p>
          </div>
        </div>
      </div>
    </div>
<!--    <div class="bottom_transactions radius">-->
<!--      <strong class="trend">{{$t('remote_rep_list')}}</strong>-->
<!--      <div class="aliasTable">-->
<!--        <div class="tableTit">-->
<!--          <Row>-->
<!--            <Col span="7">{{$t('remote_list_col1')}}</Col>-->
<!--            <Col span="6">{{$t('remote_list_col2')}}</Col>-->
<!--            <Col span="4">{{$t('remote_list_col3')}}</Col>-->
<!--            <Col span="7">{{$t('remote_list_col4')}}-->
<!--            </Col>-->
<!--          </Row>-->
<!--        </div>-->
<!--        <div class="tableCell" style="position: relative;" v-for="(item,index) in harvestBlockList" :key="index"-->
<!--             v-if="harvestBlockList.length>0">-->
<!--          <Row>-->
<!--            <Col span="7" class="col_height">{{item.hash}}</Col>-->
<!--            <Col span="6" class="col_height">{{item.height}}</Col>-->
<!--            <Col span="4" class="col_height">{{item.price}}</Col>-->
<!--            <Col span="7" class="col_height">-->
<!--              {{item.time}}-->
<!--            </Col>-->
<!--          </Row>-->
<!--        </div>-->
<!--        <div class="noData" v-if="harvestBlockList.length<=0">-->
<!--          <p>{{$t('not_yet_open')}}</p>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <Modal
            :title="$t('remote_replay')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">
      <MultisigBanCover></MultisigBanCover>

      <div class="gray_input_content" @keyup.enter="submit">
        <span class="title">{{$t('remote_modal_pul')}}</span>
        <input v-if="!isLinked" v-focus type="text" v-model="formItems.remotePublicKey" :placeholder="$t('remote_modal_place1')">
        <span v-else>{{formItems.remotePublicKey}}</span>
      </div>
      <div class="gray_input_content">
        <span class="title">{{$t('fee')}}</span>
        <span class="type value radius flex_center">
              <Select
                      data-vv-name="mosaic"
                      v-model="formItems.feeSpeed"
                      v-validate="'required'"
                      :data-vv-as="$t('fee')"
                      :placeholder="$t('fee')"
              >
              <Option v-for="item in defaultFees" :value="item.speed" :key="item.speed">
                {{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
              </Option>
          </Select>
          </span>

      </div>

      <div class="gray_input_content">
        <span class="title" v-focus>{{$t('password')}}</span>
        <input type="password" v-model="formItems.password" :placeholder="$t('remote_modal_place2')">
      </div>


      <div class="new_model_btn">
        <span class="modal_btn pointer radius" @click="submit">{{$t('remote_modal_confirm')}}</span>
      </div>
    </Modal>

  </div>

</template>

<script lang="ts">
  import "./WalletHarvesting.less"
  // @ts-ignore
  import {WalletHarvestingTs} from '@/views/wallet/wallet-details/wallet-function/wallet-harvesting/WalletHarvestingTs.ts'

  export default class WalletHarvesting extends WalletHarvestingTs {

  }
</script>

<style scoped lang="less">

</style>
