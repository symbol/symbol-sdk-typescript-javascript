<template>
  <div class="informationWrap secondary_page_animate">
    <div class="left left_article_list radius">

      <Spin v-if="isLoadingConfirmedTx" size="large" fix class="absolute"></Spin>
      <div v-if="isLoadingConfirmedTx"
           style="background-color: white;width: 100%;height: 100%;position: absolute;z-index: 0"></div>


      <div class="list_container scroll" ref="listContainer" @scroll="automaticLoadingArticle">
        <div @click="switchArticle(index)" v-for="(a,index) in articleList"
             :class="['article_summary_item',a.isSelect?'selected':'','pointer']">
          <div class="title">{{a.title}}
          </div>
          <div class="other_info">
            <span class="tag">{{$t('business')}}</span>
            <span class="from">{{a.author}}</span>
            <span class="date">{{a.gtmCreate}}</span>
          </div>
        </div>
        <div class="load_all_data" v-if="loadAllData">{{$t('no_more_data')}}</div>
      </div>

    </div>
    <div class="right_article_detail right radius">
      <div class="article_container " ref="articleContainer" @scroll="automaticLoadingComment">

        <Spin v-if="isLoadingConfirmedTx" size="large" fix class="absolute spin"></Spin>
        <div v-if="isLoadingConfirmedTx"
             style="background-color: white;width: 90%;height: 500px;position: absolute;z-index: 1"></div>

        <div class="title content article_title">
          {{currentArticle.title}}
        </div>
        <div class="other_info content">
        <span class="tag">
          {{$t('business')}}/{{$t('service')}}
        </span>
          <span class="from">
          {{currentArticle.author}}
        </span>
          <span class="date">
          {{currentArticle.gtmCreate}}
        </span>
        </div>

        <div class="artile_content scroll content" @scroll="divScroll">
          <div v-html="currentArticle.content">
          </div>
          <div class="comment">
          <span class="comment_title"><span
                  class="comment_title_text">{{$t('comment')}}  </span> ({{totalComment}})</span>

            <div class="input_container">
              <textarea v-model="commentContent"></textarea>
              <span class="textarea_text">{{$t('remaining')}}：{{remainingWords}} {{$t('word')}}</span>
            </div>

            <div @click="checkForm" class="send_comment pointer">
              {{$t('publish')}}
            </div>

            <div class="comment_item_content">
              <div v-for="(c,index) in commentList" class="comment_item">
                <div class="account_name">{{c.nickName == ''? $t('anonymous_user'):c.nickName}}</div>
                <div class="comment_content">{{c.comment}}</div>
                <div class="comment_time">{{c.gtmCreate}}</div>
              </div>
              <div class="load_all_data" v-if="loadAllCommentData && commentList.length !== 0">
                {{$t('no_more_data')}}
              </div>
              <div class="load_all_data" v-if="commentList.length === 0">{{$t('no_comment_yet')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CheckPasswordDialog
      v-if="showCheckPWDialog"
      :visible="showCheckPWDialog"
      @close="close"
      @passwordValidated="passwordValidated"
    />
  </div>
</template>

<script lang="ts">
    //@ts-ignore
    import {informationTs} from '@/views/community/information/InformationTs.ts'

    export default class InputLock extends informationTs {

    }

</script>

<style lang="less" scoped>
  @import "Information.less";
</style>
