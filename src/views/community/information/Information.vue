<template>
  <div class="informationWrap">
    <div class="left left_article_list radius">

      <Spin v-if="isLoadingConfirmedTx" size="large" fix class="absolute"></Spin>
      <div v-if="isLoadingConfirmedTx"
           style="background-color: white;width: 100%;height: 100%;position: absolute;z-index: 0"></div>


      <div class="list_container scroll" ref="listContainer" @scroll="automaticLoadingArticla">
        <div @click="switchArticle(index)" v-for="(a,index) in articleList"
             :class="['article_summary_item',a.isSelect?'selected':'','pointer']">
          <div class="title">{{a.title}}
          </div>
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
      <div class="article_container " ref="articleContainer" @scroll="automaticLoadingComment">

        <Spin v-if="isLoadingConfirmedTx" size="large" fix class="absolute spin"></Spin>
        <div v-if="isLoadingConfirmedTx"
             style="background-color: white;width: 90%;height: 500px;position: absolute;z-index: 1"></div>

        <div class="title content article_title">
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

        <div class="artile_content scroll content">
          <div v-html="currentArticle.content">
          </div>
          <div class="comment">
          <span class="comment_title"><span
                  class="comment_title_text">{{$t('comment')}}  </span> ({{totalComment}})</span>

            <div class="input_container">
              <textarea v-model="commentContent" name="" id=""></textarea>
              <span class="textarea_text">{{$t('remaining')}}：{{remainingWords}} {{$t('word')}}</span>
            </div>

            <div @click="checkForm" class="send_comment pointer">
              {{$t('publish')}}
            </div>

            <div class="comment_item_content">
              <div v-for="(c,index) in commentList" class="comment_item">
                <div class="account_name">{{c.nickName == ''? $t('anonymous_user'):c.nickName}}</div>
                <div class="comment_content">{{c.comment}}</div>
                <div class="comment_time">{{c.gtmCreate}}</div>
              </div>
              <div class="load_all_data" v-if="loadAllCommentData && commentList.length !== 0">
                {{$t('no_more_data')}}
              </div>
              <div class="load_all_data" v-if="commentList.length === 0">{{$t('no_comment_yet')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {Message} from "config/index"
    import {formatDate} from '@/help/help.ts'
    import {blog} from "@/interface/restLogic"
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

    @Component({
        components: {
            CheckPWDialog
        }
    })
    export default class information extends Vue {
        startPage = 0
        articleList = []
        commentList = []
        totalComment = 0
        commentContent = ''
        loadAllData = false
        remainingWords = 300
        commentStartPage = 0
        showCheckPWDialog = false
        loadAllCommentData = false
        isLoadingConfirmedTx = true
        currentArticle: any = {
            title: 'null',
            content: 'null'
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        checkEnd(flag) {
            if (flag) {
                this.sendComment()
            }
        }

        addArticleStartIndex() {
            this.startPage += 10
        }

        addCommentStartIndex() {
            this.commentStartPage += 10
        }

        formatDate(timestamp) {
            return formatDate(timestamp)
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

        checkForm() {
            const {commentContent} = this
            if (!commentContent || commentContent.trim() == '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            this.showCheckPWDialog = true
        }

        async sendComment() {
            const that = this
            const comment = this.commentContent
            const cid = this.currentArticle.cid
            const address = this.$store.state.account.wallet.address
            const nickName = this.$store.state.account.wallet.name
            const gtmCreate = new Date()
            try {
                await blog.commentSave({
                    cid: cid,
                    comment: comment,
                    address: address,
                    nickName: nickName,
                    gtmCreate: gtmCreate.toDateString()
                });
                that.$Notice.success({title: that.$t(Message.SUCCESS) + ''});
            } catch (e) {
                that.$Notice.error({title: that.$t(Message.OPERATION_FAILED_ERROR) + ''});
            }
            this.onCurrentArticleChange()
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
            const rstStr = await blog.list({
                offset: startPage.toString(),
                limit: "10",
                language: languageNumber.toString()
            });
            const rstQuery = JSON.parse(rstStr.rst);

            let articleList = that.articleList.concat(rstQuery.rows)
            articleList.map((item) => {
                item.summary = item.title
                return item
            })
            that.articleList = articleList
            if (rstQuery.total <= that.articleList.length) {
                that.loadAllData = true
            }
            this.isLoadingConfirmedTx = false
            this.addArticleStartIndex()
            this.articleList[0].isSelect = true
        }

        async getCommentByPage() {
            if (this.loadAllCommentData) {
                return
            }
            const that = this
            const cid = this.currentArticle.cid
            const offset = this.commentStartPage
            const rstStr = await blog.commentList({cid: cid, limit: "10", offset: offset.toString()});
            const rstQuery = JSON.parse(rstStr.rst);
            that.commentList.push(...rstQuery.rows)
            that.totalComment = rstQuery.total
            if (rstQuery.total <= that.commentList.length) {
                that.loadAllCommentData = true
            }
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
  @import "Information.less";
</style>
