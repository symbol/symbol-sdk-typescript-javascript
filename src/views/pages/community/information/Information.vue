<template>
  <div class="information-main-container secondary_page_animate">
    <Spin
      v-if="!currentArticle"
      size="large" fix
      class="absolute"
    />
    <div v-if="currentArticle" class="left left_article_list radius">
      <div ref="listContainer" class="list_container scroll">
        <div
          v-for="(a,index) in latestArticles"
          :key="index"
          :class="[ 'article_summary_item', a.isSelect ? 'selected' : '','pointer' ]"
          @click="switchArticle(a)"
        >
          <div class="title">
            {{ a.title }}
          </div>
          <div class="other_info">
            <span class="from">{{ a.creator }}</span>
            <span class="date">{{ a.pubDate }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right_article_detail right radius">
      <div class="title content article_title">
        {{ currentArticle.title }}
      </div>
      <div class="other_info content">
        <span class="from">{{ currentArticle.creator }}</span>
        <span class="date">{{ currentArticle.pubDate }}</span>
      </div>
      <div class="article_content scroll content">
        <div v-html="currentArticle.content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { InformationTs } from './InformationTs'

export default class InputLock extends InformationTs {}
</script>

<style lang="less" scoped>
@import './Information.less';
</style>
