<template>
  <div class="filterTable">

    <Modal
            :title="$t(currentTitle)"
            v-model="isShowDialog"
            :transfer="true"
            class-name="filter_dialog">

      <!--      address-->
      <div class="address_dialog" v-if="filterTypeList[0]">
        <div class="input_content">
          <div class="title">{{$t('address')}}</div>

          <div class="input_area">
            <input type="text" :placeholder="$t('address')" v-model="currentFilter">
            <span class="icon_add radius pointer tip" @click="addFilterItem()"></span>
          </div>

        </div>

        <div class="property_type" v-if="showPropertyType">
          <RadioGroup v-model="formItem.filterType">
            <Radio :label="PropertyType.AllowAddress">
              <span>allow</span>
            </Radio>
            <Radio :label="PropertyType.BlockAddress">
              <span>block</span>
            </Radio>
          </RadioGroup>
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

        <div class="filter_list_container radius">
          <div class="filter_list scroll ">
            <div class="filter_item" v-for="(f,index) in formItem.filterList">
              <span class="filter_item_str overflow_ellipsis">{{f.label}}</span>
              <span class="icon_delete" @click="removeFilterItem(index)"></span>
            </div>
          </div>
        </div>

      </div>

      <!--      mosaic-->
      <div class="address_dialog" v-if="filterTypeList[1]">
        <div class="input_content">
          <div class="title">{{$t('mosaic')}}</div>
          <div class="input_area">
            <input v-model="currentFilter" type="text" :placeholder="$t('mosaic')">
            <span class="icon_add radius pointer tip" @click="addFilterItem()"></span>
          </div>
        </div>

        <div class="property_type" v-if="showPropertyType">
          <RadioGroup v-model="formItem.filterType">
            <Radio :label="PropertyType.AllowMosaic">
              <span>allow</span>
            </Radio>
            <Radio :label="PropertyType.BlockTransaction">
              <span>block</span>
            </Radio>
          </RadioGroup>
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
        <div class="filter_list_container radius">
          <div class="filter_list scroll ">
            <div class="filter_item" v-for="(f,index) in formItem.filterList">
              <span class="filter_item_str overflow_ellipsis">{{f.label}}</span>
              <span class="icon_delete" @click="removeFilterItem(index)"></span>
            </div>
          </div>
        </div>

      </div>

      <!-- entity type-->
      <div class="address_dialog" v-if="filterTypeList[2]">
        <div class="input_content">
          <div class="title">{{$t('transaction_type')}}</div>
          <div class="input_area">

            <Select v-model="currentFilter" class="select" :placeholder="$t('please_choose_entity_type')">
              <Option v-for="item in entityTypeList" :value="item.label" :key="item.value">{{ $t(item.label )}}</Option>
            </Select>

            <span>{{currentFilter?entityTypeList[currentFilter].value:''}}</span>

            <span class="icon_add radius pointer tip" @click="addFilterItem()"></span>
          </div>
        </div>
        <div class="property_type" v-if="showPropertyType">
          <RadioGroup v-model="formItem.filterType">
            <Radio :label="PropertyType.AllowTransaction">
              <span>allow</span>
            </Radio>
            <Radio :label="PropertyType.BlockTransaction">
              <span>block</span>
            </Radio>
          </RadioGroup>
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
        <div class="filter_list_container radius">
          <div class="filter_list scroll ">
            <div class="filter_item" v-for="(f,index) in formItem.filterList">
              <span class="filter_item_str overflow_ellipsis">{{f.label}}</span>
              <span class="icon_delete" @click="removeFilterItem(index)"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="button_content">
        <span class="cancel pointer radius" @click="isShowDialog=false">{{$t('canel')}}</span>
        <span class=" confirm pointer radius" @click="confirmInput">{{$t('confirm')}}</span>
      </div>
    </Modal>


    <!--    filter panel-->
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
          <!--          <span class="right alias_delete pointer" @click="isShowDeleteIcon=true"></span>-->
          <!--          <span class="right alias_add pointer" @click="isShowDialog=true"></span>-->
          <!--          TODO filter can't use-->
          <span class="right alias_delete pointer"></span>
          <span class="right alias_add pointer"></span>
        </Col>
      </Row>
    </div>
    <div class="table_body">

      <div class="address_list" v-if="filterTypeList[0]">
        <div class="tableCell" v-for="(item,index) in aliasList" :key="index" v-if="aliasList.length>0">
          <Row>
            <Col span="21">TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN</Col>
            <Col span="1">
              <span v-show="isShowDeleteIcon" class="delete_icon pointer"></span>
            </Col>
          </Row>
        </div>
      </div>

      <div class="mosaic_list" v-if="filterTypeList[1]">
        <div class="tableCell" v-for="(item,index) in aliasList" :key="index" v-if="aliasList.length>0">
          <Row>
            <Col span="21">77a1969932d987d7</Col>
            <Col span="1">
              <span v-show="isShowDeleteIcon" class="delete_icon pointer"></span>
            </Col>
          </Row>
        </div>
      </div>

      <div class="entity_type_list" v-if="filterTypeList[2]">
      </div>
    </div>

    <div class="noData" v-if="aliasList.length<=0">
      <i><img src="@/common/img/wallet/no_data.png"></i>
      <p>{{$t('not_yet_open')}}</p>
    </div>
  </div>
</template>

<script lang="ts">
    import "./WalletFilter.less"
    import {WalletFilterTs} from './WalletFilterTs'

    export default class WalletFilter extends WalletFilterTs {

    }
</script>
<style scoped lang="less">
</style>
