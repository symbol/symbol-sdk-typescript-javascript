import {formatDate} from '@/core/utils'
import {Component, Vue} from 'vue-property-decorator'
import {ArticleFeed} from '@/core/services/community'
import RSSParser from "rss-parser"
const xss = require("xss");

@Component
export class informationTs extends Vue {
    startPage = 0
    articleList: any[] = []
    loadAllData = false
    remainingWords = 300
    scroll: any
    currentArticle: any = {title: 'null', content: 'null'}
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

    automaticLoadingArticle(e) {
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
            });
        } catch (error) {
            console.error("informationTs -> mounted -> error", error)
        }
    }
}
