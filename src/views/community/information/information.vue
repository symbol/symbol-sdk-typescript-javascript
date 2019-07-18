<template>
  <div class="informationWrap">
    <div class="left left_article_list radius">
      <div class="list_container scroll" ref="listContainer" @scroll="automaticLoadingArticla">
        <div @click="switchArticle(index)" v-for="(a,index) in articleList"
             :class="['article_summary_item',a.isSelect?'selected':'','pointer']">
          <div class="title overflow_ellipsis">{{a.title}}
          </div>
          <div class="summary overflow_ellipsis">{{a.summary}}</div>
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
      <div class="article_container scroll" ref="articleContainer" @scroll="automaticLoadingComment">
        <div class="title content">
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
        <div class="picture content">
          <img src="../../../assets/images/community/article/articleBanner.png" alt="">
        </div>
        <div v-html="currentArticle.content" class="artile_content content">
        </div>

        <div class="comment">
          <span class="comment_title"><span class="comment_title_text">评论 </span>({{totalComment}})</span>

          <div class="input_container">
            <textarea v-model="commentContent" name="" id=""></textarea>
            <span class="textarea_text">{{$t('remaining')}}：{{remainingWords}}{{$t('word')}}</span>
          </div>

          <div @click="sendComment" class="send_comment pointer">
            {{$t('publish')}}
          </div>

          <div class="comment_item_content">
            <div v-for="(c,index) in commentList" class="comment_item">
              <div class="account_name">{{c.nickName == ''? $t('anonymous_user'):c.nickName}}</div>
              <div class="comment_content">{{c.comment}}</div>
              <div class="comment_time">{{c.gtmCreate}}</div>
            </div>
            <div class="load_all_data" v-if="loadAllCommentData && commentList.length !== 0">{{$t('no_more_data')}}</div>
            <div class="load_all_data" v-if="commentList.length === 0">{{$t('no_comment_yet')}}</div>

          </div>

        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import axios from 'axios'
    import {formatDate} from '../../../utils/util.js'
    import CheckPWDialog from '../../../components/checkPW-dialog/CheckPWDialog.vue'

    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class information extends Vue {
        showCheckPWDialog = false
        articleList = []
        currentArticle: any = {
            title: 'null',
            content: 'null'
        }
        totalComment = 0
        commentContent = ''
        startPage = 0
        commentStartPage = 0
        loadAllData = false
        commentList = []
        remainingWords = 300
        loadAllCommentData = false


        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        checkEnd(flag) {
            console.log(flag)
        }

        addArticleStartIndex() {
            this.startPage += 10
        }

        addCommentStartIndex() {
            this.commentStartPage += 10
        }

        switchArticle(index) {
            let list = this.articleList
            this.currentArticle = list[index]
            list = list.map((item) => {
                item.isSelect = false
                return item
            })
            list[index].isSelect = true
            this.articleList = list
        }

        async sendComment() {

            this.showCheckPWDialog = true

            const that = this
            const comment = this.commentContent
            const cid = this.currentArticle.cid
            const address = 'addres stest'
            const nickName = 'nick nametest'
            // const gtmCreate = formatDate((new Date()).valueOf()).replace('-','/')
            const gtmCreate = new Date()

            const url = `${this.$store.state.app.communityUrl}/rest/blog/comment/save?cid=${cid}&comment=${comment}&address=${address}&nickName=${nickName}&gtmCreate=${gtmCreate}`
            console.log(url)
            await axios.get(url).then(function (response) {
                console.log(response)
            })
            this.onCurrentArticleChange()
        }

        formatDate(timestamp) {
            return formatDate(timestamp)
        }

        switchLanguege() {
            const abbreviation = this.$store.state.app.local.abbr
            let languageNumber = 1
            switch (abbreviation) {
                case 'zh-CN':
                    languageNumber = 1;
                    break;
                case 'en-US' :
                    languageNumber = 2;
                    break;
            }
            console.log(languageNumber)
            return languageNumber;
        }

        automaticLoadingArticla(e) {
            const allHeight = this.$refs.listContainer['scrollHeight']
            const scrollHeight = this.$refs.listContainer['offsetHeight'] + this.$refs['listContainer']['scrollTop']
            if (allHeight <= scrollHeight) {
                this.getArticleByPage()
            }
        }

        automaticLoadingComment() {
            const allHeight = this.$refs.articleContainer['scrollHeight']
            const scrollHeight = this.$refs.articleContainer['offsetHeight'] + this.$refs.articleContainer['scrollTop']
            if (allHeight <= scrollHeight) {
                this.getCommentByPage()
            }
        }


        async getArticleByPage() {
            if (this.loadAllData) {
                return
            }
            const languageNumber = this.switchLanguege()
            const that = this
            const {startPage} = this
            const url = `${this.$store.state.app.communityUrl}/rest/blog/list?limit=10&offset=${startPage}&language=${languageNumber}`
            await axios.get(url).then(function (response) {
                let articleList = that.articleList.concat(response.data.rows)
                articleList.map((item) => {
                    item.summary = item.title
                    return item
                })
                that.articleList = articleList
                console.log(response)
                if (response.data.total <= that.articleList.length) {
                    that.loadAllData = true
                }
            })
            this.addArticleStartIndex()
        }

        async getCommentByPage() {
            if (this.loadAllCommentData) {
                return
            }
            const that = this
            const cid = this.currentArticle.cid
            const offset = this.commentStartPage
            const url = `${this.$store.state.app.communityUrl}/rest/blog/comment/list?cid=${cid}&limit=10&offset=${offset}`
            await axios.get(url).then(function (response) {
                that.commentList.push(...response.data.rows)
                that.totalComment = response.data.total
                if (response.data.total <= that.commentList.length) {
                    that.loadAllCommentData = true
                }
            })
            this.addCommentStartIndex()
        }

        resetComment() {
            this.commentList = []
            this.commentStartPage = 0
            this.totalComment = 0
            this.loadAllCommentData = false
        }

        @Watch('currentArticle')
        onCurrentArticleChange() {
            this.resetComment()
            this.getCommentByPage()
        }

        @Watch('commentContent')
        onCommentContent(after, before) {
            this.remainingWords = 300 - this.commentContent.length
            if (this.commentContent.length > 300) {
                this.commentContent = before
            }
        }

        async created() {
            const languageNumber = this.switchLanguege()
            await this.getArticleByPage()
            this.currentArticle = this.articleList[0]
            const listContainer = this.$refs.listContainer;
        }

    }
</script>

<style lang="less" scoped>
  @import "information.less";
</style>
