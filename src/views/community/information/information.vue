<template>
  <div class="informationWrap">
    <div class="left  hide_scroll left_article_list">
      <div @click="switchArticle(index)" v-for="(a,index) in articleList"
           :class="['article_summary_item',a.isSelect?'selected':'']">
        <div class="title overflow_ellipsis">{{a.title}}
        </div>
        <div class="summary overflow_ellipsis">{{a.summary}}</div>
        <div class="other_info">
          <span class="tag">商业</span>
          <span class="from">nem</span>
          <span class="date">2019年7月10日</span>
        </div>
      </div>
    </div>
    <div class="right_article_detail hide_scroll right">
      <div class="title">
        {{currentArticle.title}}
      </div>
      <div class="other_info">
        <span class="tag">
          商业/服务
        </span>
        <span class="from">
          NEM社区
        </span>
        <span class="date">
          2019年7月10日
        </span>
      </div>
      <div class="picture">
        <img src="../../../assets/images/community/article/articleBanner.png" alt="">
      </div>
      <div class="artile_content">
        <pre>{{currentArticle.content}}</pre>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class information extends Vue {
        articleList = [
            {
                title: '目前在模式下无法读取加密消息并捕获',
                summary: 'Football正在重新创造一个游戏中的收藏运动卡体验',
                isSelect: false,
                content: '亲爱的社区，\n' +
                    '本月我们一直在忙着迎接即将到来的Catapult今年秋季推出。以下是NEM基金会的最新进展。\n' +
                    '翻译\n' +
                    '中国人 - 这里\n' +
                    '西班牙语 - 这里\n' +
                    '俄罗斯 - 在这里\n' +
                    '日本人 - 在这里\n' +
                    '意大利语 - 这里\n' +
                    'NEM基金会路线图和弹射器更新2019年6月\n' +
                    'Catapult开发人员中心正在开发中。它包含工具和知识库，包括教程，文档和示例应用程序，以便开始使用Catapult。Javascript / Typescript和Java SDK正/en/tet'
            },{
                title: '目前在模式下无法读取加密消息并捕获',
                summary: 'Football正在重新创造一个游戏中的收藏运动卡体验',
                isSelect: false,
                content: '亲爱的社区，\n' +
                    '本月我们一直在忙着迎接即将到来的Catapult今年秋季推出。以下是NEM基金会的最新进展。\n' +
                    '翻译\n' +
                    '中国人 - 这里\n' +
                    '西班牙语 - 这里\n' +
                    '俄罗斯 - 在这里\n' +
                    '日本人 - 在这里\n' +
                    '意大利语 - 这里\n' +
                    'NEM基金会路线图和弹射器更新2019年6月\n' +
                    'Catapult开发人员中心正在开发中。它包含工具和知识库，包括教程，文档和示例应用程序，以便开始使用Catapult。Javascript / Typescript和Java SDK正/en/tet'
            },{
                title: '目前在模式下无法读取加密消息并捕获',
                summary: 'Football正在重新创造一个游戏中的收藏运动卡体验',
                isSelect: false,
                content: '亲爱的社区，\n' +
                    '本月我们一直在忙着迎接即将到来的Catapult今年秋季推出。以下是NEM基金会的最新进展。\n' +
                    '翻译\n' +
                    '中国人 - 这里\n' +
                    '西班牙语 - 这里\n' +
                    '俄罗斯 - 在这里\n' +
                    '日本人 - 在这里\n' +
                    '意大利语 - 这里\n' +
                    'NEM基金会路线图和弹射器更新2019年6月\n' +
                    'Catapult开发人员中心正在开发中。它包含工具和知识库，包括教程，文档和示例应用程序，以便开始使用Catapult。Javascript / Typescript和Java SDK正/en/tet'
            },{
                title: '目前在模式下无法读取加密消息并捕获',
                summary: 'Football正在重新创造一个游戏中的收藏运动卡体验',
                isSelect: false,
                content: '亲爱的社区，\n' +
                    '本月我们一直在忙着迎接即将到来的Catapult今年秋季推出。以下是NEM基金会的最新进展。\n' +
                    '翻译\n' +
                    '中国人 - 这里\n' +
                    '西班牙语 - 这里\n' +
                    '俄罗斯 - 在这里\n' +
                    '日本人 - 在这里\n' +
                    '意大利语 - 这里\n' +
                    'NEM基金会路线图和弹射器更新2019年6月\n' +
                    'Catapult开发人员中心正在开发中。它包含工具和知识库，包括教程，文档和示例应用程序，以便开始使用Catapult。Javascript / Typescript和Java SDK正/en/tet'
            },{
                title: '目前在模式下无法读取加密消息并捕获',
                summary: 'Football正在重新创造一个游戏中的收藏运动卡体验',
                isSelect: false,
                content: '亲爱的社区，\n' +
                    '本月我们一直在忙着迎接即将到来的Catapult今年秋季推出。以下是NEM基金会的最新进展。\n' +
                    '翻译\n' +
                    '中国人 - 这里\n' +
                    '西班牙语 - 这里\n' +
                    '俄罗斯 - 在这里\n' +
                    '日本人 - 在这里\n' +
                    '意大利语 - 这里\n' +
                    'NEM基金会路线图和弹射器更新2019年6月\n' +
                    'Catapult开发人员中心正在开发中。它包含工具和知识库，包括教程，文档和示例应用程序，以便开始使用Catapult。Javascript / Typescript和Java SDK正/en/tet'
            },{
                title: '目前在模式下无法读取加密消息并捕获',
                summary: 'Football正在重新创造一个游戏中的收藏运动卡体验',
                isSelect: false,
                content: '亲爱的社区，\n' +
                    '本月我们一直在忙着迎接即将到来的Catapult今年秋季推出。以下是NEM基金会的最新进展。\n' +
                    '翻译\n' +
                    '中国人 - 这里\n' +
                    '西班牙语 - 这里\n' +
                    '俄罗斯 - 在这里\n' +
                    '日本人 - 在这里\n' +
                    '意大利语 - 这里\n' +
                    'NEM基金会路线图和弹射器更新2019年6月\n' +
                    'Catapult开发人员中心正在开发中。它包含工具和知识库，包括教程，文档和示例应用程序，以便开始使用Catapult。Javascript / Typescript和Java SDK正/en/tet'
            },{
                title: '目前在模式下无法读取加密消息并捕获',
                summary: 'Football正在重新创造一个游戏中的收藏运动卡体验',
                isSelect: false,
                content: '亲爱的社区，\n' +
                    '本月我们一直在忙着迎接即将到来的Catapult今年秋季推出。以下是NEM基金会的最新进展。\n' +
                    '翻译\n' +
                    '中国人 - 这里\n' +
                    '西班牙语 - 这里\n' +
                    '俄罗斯 - 在这里\n' +
                    '日本人 - 在这里\n' +
                    '意大利语 - 这里\n' +
                    'NEM基金会路线图和弹射器更新2019年6月\n' +
                    'Catapult开发人员中心正在开发中。它包含工具和知识库，包括教程，文档和示例应用程序，以便开始使用Catapult。Javascript / Typescript和Java SDK正/en/tet'
            },{
                title: '目前在模式下无法读取加密消息并捕获',
                summary: 'Football正在重新创造一个游戏中的收藏运动卡体验',
                isSelect: false,
                content: '亲爱的社区，\n' +
                    '本月我们一直在忙着迎接即将到来的Catapult今年秋季推出。以下是NEM基金会的最新进展。\n' +
                    '翻译\n' +
                    '中国人 - 这里\n' +
                    '西班牙语 - 这里\n' +
                    '俄罗斯 - 在这里\n' +
                    '日本人 - 在这里\n' +
                    '意大利语 - 这里\n' +
                    'NEM基金会路线图和弹射器更新2019年6月\n' +
                    'Catapult开发人员中心正在开发中。它包含工具和知识库，包括教程，文档和示例应用程序，以便开始使用Catapult。Javascript / Typescript和Java SDK正/en/tet'
            }
        ]
        currentArticle = {}
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
        created() {
            this.currentArticle = this.articleList[0]
        }

    }
</script>

<style lang="less" scoped>
  @import "information.less";
</style>
