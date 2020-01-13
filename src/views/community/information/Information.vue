<template>
  <div class="informationWrap secondary_page_animate">
    <Spin
      v-if="!currentArticle.title" size="large" fix
      class="absolute"
    />
    <div v-if="currentArticle.title" class="left left_article_list radius">
      <div ref="listContainer" class="list_container scroll" @scroll="automaticLoadingArticle">
        <div
          v-for="(a,index) in articleList"
          :key="index"
          :class="[ 'article_summary_item',a.isSelect ? 'selected' : '','pointer' ]"
          @click="switchArticle(index)"
        >
          <div class="title">
            {{ a.title }}
          </div>
          <div class="other_info">
            <span class="from">{{ a.creator }}</span>
            <span class="date">{{ formatDate(Date.parse(a.pubDate)) }}</span>
          </div>
        </div>
        <div v-if="loadAllData" class="load_all_data">
          {{ $t('no_more_data') }}
        </div>
      </div>
    </div>
    <div class="right_article_detail right radius">
      <div class="title content article_title">
        {{ currentArticle.title }}
      </div>
      <div class="other_info content">
        <span class="from">{{ currentArticle.creator }}</span>
        <span class="date">{{ formatDate(Date.parse(currentArticle.pubDate)) }}</span>
      </div>
      <div class="article_content scroll content" @scroll="divScroll">
        <div v-html="currentArticle.content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { InformationTs } from '@/views/community/information/InformationTs.ts'
import './Information.less'
export default class InputLock extends InformationTs {}
</script>

<style lang="less" scoped>
</style>
