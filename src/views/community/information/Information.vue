<template>
  <div class="informationWrap secondary_page_animate">
    <Spin v-if="!currentArticle.title" size="large" fix class="absolute"></Spin>
    <div class="left left_article_list radius">
      <div class="list_container scroll" ref="listContainer" @scroll="automaticLoadingArticle">
        <div
          @click="switchArticle(index)"
          v-for="(a,index) in articleList"
          :class="['article_summary_item',a.isSelect?'selected':'','pointer']"
        >
          <div class="title">{{a.title}}</div>
          <div class="other_info">
            <span class="from">{{a.creator}}</span>
            <span class="date">{{formatDate(Date.parse(a.pubDate))}}</span>
          </div>
        </div>
        <div class="load_all_data" v-if="loadAllData">{{$t('no_more_data')}}</div>
      </div>
    </div>
    <div class="right_article_detail right radius">
      <div class="title content article_title">{{currentArticle.title}}</div>
      <div class="other_info content">
        <span class="from">{{currentArticle.creator}}</span>
        <span class="date">{{ formatDate(Date.parse(currentArticle.pubDate))}}</span>
      </div>
      <div class="article_content scroll content" @scroll="divScroll">
        <div v-html="currentArticle.content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { informationTs } from "@/views/community/information/InformationTs.ts";
import "./Information.less";
export default class InputLock extends informationTs {}
</script>

<style lang="less" scoped>
</style>
