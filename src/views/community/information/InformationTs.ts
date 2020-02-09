/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {ArticleEntry} from '@/services/CommunityService'

@Component({computed: {...mapGetters({
  currentArticle: 'community/currentArticle',
  latestArticles: 'community/latestArticles',
})}})
export class InformationTs extends Vue {
  /**
   * Currently active article
   * @var {string}
   */
  public currentArticle: string

  /**
   * List of latest articles
   * @var {ArticleEntry[]}
   */
  public latestArticles: ArticleEntry[]

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public async mounted() {
    await this.$store.dispatch('community/initialize')
  }

  /**
   * Switch the active article
   * @param {string} title
   * @return {void}
   */
  public switchArticle(article: ArticleEntry) {
    this.$store.dispatch('community/SET_CURRENT_ARTICLE', article)
  }
}
