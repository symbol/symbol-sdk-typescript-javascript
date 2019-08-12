<template xmlns="http://www.w3.org/1999/html">
  <div class="remote_board_container">

    <div class="top_network_info radius scroll" style="display: block;">
      <div class="remote_total">
        <strong class="trend"> {{$t('Remote_title_recipt')}}</strong>
        <div class="num_class">
          <span class="trend_red"> 0.000</span>
        </div>
        <div class="state_class">
          <div class="div_cer">
            <span>{{$t('Remote_state')}}:&nbsp&nbsp</span>
            <span>Unlink</span>
            <div class="switch-container switch_class_left" v-on:click="switchChan">
              <input type="checkbox" id="user-switch" v-model="switchMark">
              <label for="user-switch"></label>
            </div>
          </div>
          <div class="top_class_div">
            <span>{{$t('Remote_pubulic_pik')}}:&nbsp&nbsp</span>
            <span>null</span>
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
      <!--            <div class="table_border">-->
      <!--                <i-table :data="tableData" :columns="tableColumns" size="small"></i-table>-->
      <!--                <div style="margin: 10px;overflow: hidden">-->
      <!--                    <div style="float: right;">-->
      <!--                        <Page :total="100" :current="1" @on-change="changePage"></Page>-->
      <!--                    </div>-->
      <!--                </div>-->
      <!--            </div>-->
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
        <div class="tableCell" style="position: relative;" v-for="(item,index) in aliasList" :key="index"
             v-if="aliasList.length>0">
          <Row>
            <Col span="7" class="col_height">{{item.hash}}</Col>
            <Col span="6" class="col_height">{{item.height}}</Col>
            <Col span="4" class="col_height">{{item.price}}</Col>
            <Col span="7" class="col_height">
              {{item.time}}
<!--              <img src="@/common/img/monitor/remote_slices.png">-->
            </Col>
          </Row>
        </div>

        <div class="noData" v-if="aliasList.length<=0">
          <p>{{$t('remote_no_data')}}</p>
        </div>
      </div>

    </div>

    <div id="modal" class="modal" v-show="modalMark">
      <div class="modal-content">
        <div class="new_modal_div1">
          <span class="new_modal_title">{{$t('remote_repaly')}}</span>
        </div>

        <div class="new_modal_div2">
          <span class="new_modal_span1">{{$t('remote_modal_pul')}}</span>
        </div>
        <div class="new_modal_div3">
          <input class="new_modal_input" type="text" :placeholder="$t('remote_modal_place1')">
        </div>
        <div class="new_modal_div4">
          <span class="new_modal_span1">{{$t('remote_modal_price')}}</span>
        </div>
        <div class="new_modal_div3">
          <input class="new_modal_input" type="text" placeholder="0">
        </div>
        <div class="new_modal_div4">
          <span class="new_modal_span1">{{$t('reomte_modal_pass')}}</span>
        </div>
        <div class="new_modal_div3">
          <input class="new_modal_input" type="text" :placeholder="$t('remote_modal_place2')">
        </div>

        <div class="new_model_btn">
          <span class="modal_btn_cancel pointer" @click="modalCancel">{{$t('remote_modal_cancel')}}</span>
          <span class="modal_btn pointer" @click="modalCancel">{{$t('remote_modal_comfire')}}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';


    @Component({})
    export default class MonitorRemote extends Vue {
        modal1 = false
        modalMark = false
        switchMark = false
        switchState = false
        tableColumns = [

        ]
        aliasList = [

        ]

        changePage() {

        }

        modalOk() {

        }

        modalCancel() {
            this.modalMark = false
        }

        switchChan() {
            if (this.switchMark == false) {
                this.modalMark = true
            }
        }
    }
</script>

<style scoped lang="less">
  @import "MonitorRemote.less";
</style>
