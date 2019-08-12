<template>
  <div class="apostille_create_container">
    <div class="content_head_title">
      {{$t('apotille_transaction')}}
    </div>

    <div class="main_panel">
      <div class="top_function_panel">
        <div class="left_input left">
          <div class="gray_item">
            <div class="title">
              {{$t('tag')}}
            </div>
            <div class="input_container">
              <input type="text"
                     v-model="tag"
                     :placeholder="$t('Please_enter_the_label_before_filling_in_the_label')">
            </div>
          </div>

          <div class="gray_item">
            <div class="title">
              {{$t('hash_algorithm')}}
            </div>
            <div class="input_container">
              <Select v-model="hashAlgorithm" class="select" :placeholder="$t('hash_algorithm')">
                <Option v-for="item in hashAlgorithmList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
            </div>
          </div>
        </div>

        <div class="right_import left">
          <div class="top_tag pointer">
            <span @click="isImportFile = true" :class="['top_tag_item','radius',isImportFile?'active':'']">
              <span class="import_file"></span>
              <span>{{$t('import_file')}}</span>
            </span>
            <span @click="isImportFile = false" :class="['top_tag_item','radius',isImportFile?'':'active']">
              <span class="write_text"></span>
              <span>{{$t('create_character_document')}}</span>
            </span>
          </div>

          <div class="bottom_panel radius">

            <div v-if="isImportFile" class="import_file">

              <div v-if="tag == ''">
                <img src="@/common/img/service/apostille/apostilleLock.png" alt="">
                <span>{{$t('Please_enter_the_label_before_filling_in_the_label')}}</span>
              </div>
              <div v-else>
                <img src="@/common/img/service/apostille/apostilleImportFile.png" alt="">
                <span>{{$t('Drag_and_drop_files_to_this_point_click_or_browse')}}</span>
              </div>
            </div>


            <div v-else class="create_document">
              <div>
                <input :placeholder="$t('file_name')" class="top_file_name radius" type="text">
              </div>
              <div>
                <textarea :placeholder="$t('please_input_text_to_apostille')"></textarea>
              </div>
              <div class="add">
                {{$t('add')}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom_table">
        <div class="table_main_head">
          {{$t('Notarized_documents')}}
        </div>

        <div class="main_table radius">

          <div class="table_head">
            <span class="file_name">{{$t('file_name')}}</span>
            <span class="tag">{{$t('tag')}}</span>
            <span class="sink">Sink</span>
            <span class="hash">hash</span>
            <span class="fee">{{$t('fee')}}</span>
            <span class="delete">{{$t('delete')}}</span>
          </div>

          <div class="table_item_list scroll">

            <div v-if="transationList.length == 0" class="noData" >
              <i><img src="@/common/img/wallet/no_data.png"></i>
              <p>{{$t('not_yet_open')}}</p>
            </div>

            <div class="table_item" v-for="i in transationList">
              <span class="file_name">index.txt</span>
              <span class="tag">text</span>
              <span class="sink">NAXEBTXH4YXDZMSUYROEKNGIKF4SJV2OEWZJAXBQ</span>
              <span class="hash">fe4e54598370789440e2fffc688c1dd92e254dd9e1f56594f02160dd3b13d40cb3fec81f04639525db23c034770f5509ec35a83f6e84c8f930bbf63ed327b506449dfadb02</span>
              <span class="fee">0.2</span>
              <span class="delete">
                <img src="@/common/img/service/apostille/apostilleDelete.png" alt="">
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="send">
      {{$t('send')}}
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class ApostilleCreate extends Vue {
        tag = ''
        hashAlgorithm = ''
        transationList = []
        isImportFile = true
        hashAlgorithmList = [
            {
                value: 'SHA-256',
                label: 'SHA-256'
            }
        ]

    }
</script>
<style scoped lang="less">
  @import "ApostilleCreate.less";
</style>
