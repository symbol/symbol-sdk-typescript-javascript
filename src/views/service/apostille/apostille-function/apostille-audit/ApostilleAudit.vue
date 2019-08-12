<template>
  <div class="apostille_audit_container">
    <div class="top_tips">
      <div class="head">
        {{$t('Apostille_format_example')}}
      </div>
      <div class="tips_title">
        {{$t('The_file_to_be_audited_must_exist_in_Apostille_format_You_can_confirm_the_file_by_file_name')}}
      </div>
      <div class="example">
        {{$t('example')}} : MyProject2016 - TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S -- Apostille TX
        0e94da29910ae64bb544e9de0e6a5c6440bd75e6bedafd81b5b4cfa729ca25ef -- Date 2016-09-12.pdf
      </div>
    </div>

    <div class="middle_audit">
      <div class="head_title">{{$t('audit_file')}}</div>
      <div class="audit_content radius">
        <img src="@/common/img/service/apostille/apostilleImportFile.png" alt="">
        <span>{{$t('Drag_and_drop_files_to_this_point_click_or_browse')}}</span>
      </div>
    </div>

    <div class="bottom_table">
      <div class="table_main_head">
        <span >
          {{$t('apostille_result')}}
        </span>
        <span class="delete_style">
          <img src="@/common/img/service/apostille/apostilleDeleteGray.png" alt="">{{$t('Delete_records_locally')}}
        </span>
      </div>

      <div class="main_table radius">

        <div class="table_head">
          <span class="file_name">{{$t('file_name')}}</span>
          <span class="owner">{{$t('Owner')}}</span>
          <span class="hash">hash</span>
          <span class="result">{{$t('result')}}</span>
        </div>

        <div class="table_item_list scroll">


          <div v-if="transationList.length == 0" class="noData" >
            <i><img src="@/common/img/wallet/no_data.png"></i>
            <p>{{$t('not_yet_open')}}</p>
          </div>


          <div class="table_item" v-for="i in transationList">
            <span class="file_name">index.txt</span>
            <span class="owner">NAXEBTXH4YXDZMSUYROEKNGIKF4SJV2OEWZJAXBQ</span>
            <span class="hash">fe4e54598370789440e2fffc688c1dd92e254dd9e1f56594f02160dd3b13d40cb3fec81f04639525db23c034770f5509ec35a83f6e84c8f930bbf63ed327b506449dfadb02</span>
            <span class="result">
                {{$t('Successful_certification')}}
              </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class ApostilleAudit extends Vue {
        transationList = []

    }
</script>
<style scoped lang="less">
  @import "ApostilleAudit.less";
</style>
