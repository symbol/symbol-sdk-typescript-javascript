<template>
  <div class="information-main-container secondary_page_animate">
    <Spin v-if="!latestArticles.length" size="large" fix class="absolute" />
    <div v-else class="articles-container">
      <div v-for="(a, index) in latestArticles" :key="index" class="article-outer-container">
        <div class="article-inner-container">
          <div class="article-left-section">
            <span class="article-date">{{ a.pubDate | moment('ddd, MMMM Do YYYY') }}</span>
            <span class="article-from">{{ $t('article_by', { creator: a.creator }) }}</span>
            <span class="article-link">
              <Icon type="md-open" size="20" class="link-icon" />
              <a :href="a.link" target="_blank">{{ $t('news_read_more') }}</a>
            </span>
          </div>
          <div class="article-right-section">
            <span class="article-title">{{ a.title }}</span>
            <span class="article-content">{{ a.contentSnippet }}</span>
          </div>
        </div>
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
