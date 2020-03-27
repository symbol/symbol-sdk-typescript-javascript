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
import {Store} from 'vuex'
import RSSParser from 'rss-parser'
import axios from 'axios'
import * as XSSSanitizer from 'xss'

// internal dependencies
import {AbstractService} from './AbstractService'
import {Formatters} from '@/core/utils/Formatters'

// configuration
import appConfig from '@/../config/app.conf.json'

/// region protected helpers
/**
 * Request external feed data
 * @internal
 * @return {Promise<string>}
 */
const request = async (): Promise<string> => {
  let feedUrl = appConfig.articlesFeedUrl
  if (process.env.NODE_ENV === 'development') {
    feedUrl = '/nemflash'
  }

  // execute request
  const response = await axios.get(feedUrl, { params: {} })
  return response.data
}
/// end-region protected helpers

export interface ArticleEntry {
  /**
   * Publication date
   * @var {string}
   */
  pubDate: string
  /**
   * Article creator 
   * @var {string}
   */
  creator: string
  /**
   * Article title
   * @var {string}
   */
  title: string
  /**
   * Article content
   * @var {string}
   */
  content: string
}

export class CommunityService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'community'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Get latest articles from RSS feed
   * @return {Promise<ArticleEntry[]}
   */
  public async getLatestArticles(): Promise<any[]> {
    const data = await request()
    const parser = new RSSParser()

    return new Promise((resolve, reject) => {
      parser.parseString(data, (err, parsed) => {
        if (err)
        {return reject(`Error occured while parsing RSS Feed ${err.toString()}`)}
      
        // - parse item and sanitize content
        const articles = parsed.items.map(item => {
          return Object.assign({}, item, {
            content: XSSSanitizer.filterXSS(item['content:encoded']),
            pubDate: Formatters.formatDate(Date.parse(item.pubDate)),
          })
        })
      
        return resolve(articles)
      })
    })
  }
}
