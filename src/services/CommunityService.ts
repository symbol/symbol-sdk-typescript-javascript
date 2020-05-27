/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import RSSParser from 'rss-parser'
import axios from 'axios'
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
   */
  pubDate: string
  /**
   * Article creator
   */
  creator: string
  /**
   * Article title
   */
  title: string
  /**
   * Article excerpt
   */
  contentSnippet: string
  /**
   * Article link
   */
  link: string
}

export class CommunityService {
  /**
   * Get latest articles from RSS feed
   * @return {Promise<ArticleEntry[]}
   */
  public async getLatestArticles(): Promise<ArticleEntry[]> {
    const data = await request()
    const parsedStream = await new RSSParser().parseString(data)

    return parsedStream.items.map(({ pubDate, creator, title, contentSnippet, link }) => ({
      pubDate,
      creator,
      title,
      contentSnippet,
      link,
    }))
  }
}
