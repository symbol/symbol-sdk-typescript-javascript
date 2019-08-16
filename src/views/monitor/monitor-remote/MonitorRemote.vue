<template>
  <div class="remote_board_container">
    <div class="top_network_info radius scroll" style="display: block;">
      <div class="remote_total">
        <strong class="trend"> {{$t('Remote_title_recipt')}}</strong>
        <div class="num_class">
          <span class="trend_red"> 0.000</span>
        </div>
        <div class="state_class">
          <div class="div_cer">
            <span class="remote_public_key">{{$t('Remote_state')}}：</span>
            <span>{{isLinked?'Linked':'Unlink'}}</span>
            <i-switch v-model="isLinked" @on-change="toggleSwitch"/>

          </div>
          <div class="top_class_div">
            <span class="remote_public_key">{{$t('Remote_pubulic_pik')}}：</span>
            <span>{{remotePublickey?remotePublickey:'no remote account'}}</span>
          </div>
        </div>
      </div>
      <div class="question_class">
        <div>
          <strong class="trend_ques">{{$t('Remote_question')}}</strong>
        </div>
        <div>
          <div class="wid_bord_class">
            <span class="bord_class">{{$t('Remote_ques1')}}</span>
          </div>
          <div class="content_des">
            <span class="content_font">{{$t('remote_ques1_rep')}}</span>
          </div>
        </div>
        <div>
          <div class="wid_bord_class">
            <span class="bord_class">{{$t('remote_ques2')}}</span>
          </div>
          <div class="content_des">
            <span class="content_font">{{$t('remote_ques2_rep')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_transactions radius">
      <strong class="trend">{{$t('remote_rep_list')}}</strong>
      <div class="aliasTable">
        <div class="tableTit">
          <Row>
            <Col span="7">{{$t('remote_list_col1')}}</Col>
            <Col span="6">{{$t('remote_list_col2')}}</Col>
            <Col span="4">{{$t('remote_list_col3')}}</Col>
            <Col span="7">{{$t('remote_list_col4')}}
            </Col>
          </Row>
        </div>
        <div class="tableCell" style="position: relative;" v-for="(item,index) in harvestBlockList" :key="index"
             v-if="harvestBlockList.length>0">
          <Row>
            <Col span="7" class="col_height">{{item.hash}}</Col>
            <Col span="6" class="col_height">{{item.height}}</Col>
            <Col span="4" class="col_height">{{item.price}}</Col>
            <Col span="7" class="col_height">
              {{item.time}}
            </Col>
          </Row>
        </div>
        <div class="noData" v-if="harvestBlockList.length<=0">
          <p>{{$t('not_yet_open')}}</p>
        </div>
      </div>

    </div>


    <Modal
            :title="$t('remote_repaly')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">


      <div class="gray_input_content">
        <span class="title">{{$t('remote_modal_pul')}}</span>
        <input type="text" v-model="formItem.remotePublickey" :placeholder="$t('remote_modal_place1')">
      </div>

      <div class="gray_input_content">
        <span class="title">{{$t('fee')}}</span>
        <input type="text" v-model="formItem.fee" :placeholder="$t('remote_modal_place1')">
        <span class="gas">gas</span>
      </div>


      <div class="gray_input_content">
        <span class="title">{{$t('password')}}</span>
        <input type="password" v-model="formItem.password" :placeholder="$t('remote_modal_place2')">

      </div>


      <div class="new_model_btn">
        <span class="modal_btn pointer radius" @click="confirmInput">{{$t('remote_modal_comfire')}}</span>
      </div>
    </Modal>

  </div>

</template>

<script lang="ts">
    import "./MonitorRemote.less"
    import {MonitorRemoteTs} from './MonitorRemoteTs'

    export default class MonitorRemote extends MonitorRemoteTs {

    }
</script>

<style scoped lang="less">

</style>
