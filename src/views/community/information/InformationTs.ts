import {formatDate} from '@/core/utils'
import {Component, Vue} from 'vue-property-decorator'
import {ArticleFeed} from '@/core/services/community'
import RSSParser from 'rss-parser'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xss = require('xss')

@Component
export class InformationTs extends Vue {
  startPage = 0
  articleList: any[] = []
  loadAllData = false
  remainingWords = 300
  scroll: any
  currentArticle = {title: null, content: null, creator: null, pubDate: null} 
  formatDate = formatDate

  addArticleStartIndex() {
    this.startPage += 10
  }

  switchArticle(index) {
    let list: any = this.articleList
    this.currentArticle = list[index]
    list = list.map((item) => {
      item.isSelect = false
      return item
    })
    list[index].isSelect = true
    this.articleList = list
    this.scrollTop()
  }

  divScroll(div) {
    this.scroll = div
  }

  scrollTop() {
    this.scroll ? this.scroll.target.scrollTop = 0 : ''
  }

  automaticLoadingArticle() {
    const allHeight = this.$refs.listContainer['scrollHeight']
    const scrollHeight = this.$refs.listContainer['offsetHeight'] + this.$refs['listContainer']['scrollTop']
    if (allHeight <= scrollHeight) {
      this.getArticleByPage()
    }
    this.getArticleByPage()
  }

  async getArticleByPage() {

    if (this.loadAllData) {
      return
    }
    this.addArticleStartIndex()
  }


  async mounted() {
    try {
      const data = await ArticleFeed.reqFeed()
      const parser = new RSSParser()
      parser.parseString(data, (err, parsed) => {
        if (err) {
          console.error(`Error occured while parsing RSS Feed ${err.toString()}`)
        } else {
          parsed.items.forEach(item => {
            this.articleList.push({
              creator: item.creator,
              pubDate: item.pubDate,
              title: item.title,
              content: xss(item['content:encoded']),
            })
          })
          this.articleList[0].isSelect = true
          this.currentArticle = this.articleList[0]
          this.getArticleByPage()
        }
      })
    } catch (error) {
      console.error('InformationTs -> mounted -> error', error)
    }
  }
}
