<template>
  <div class="vote_container">
    <div class="top_button">
      <span
              @click="swicthVoteAction(index)"
              :class="['transaction_btn',t.isSelect?'selected_button':'', t.disabled?'disabled_button':'']"
              v-for="(t,index) in transferTypeList">{{t.name}}
        </span>
    </div>
    <div class="bottom_vote_list">
      <div @click="switchVote(index)" v-for="(a,index) in voteList"
           :class="['article_summary_item',a.isSelect?'selected':'']">
        <div class="title overflow_ellipsis">{{a.title}}
        </div>
        <div class="summary overflow_ellipsis">{{a.content}}</div>
        <div class="other_info">
          <span class="tag">商业</span>
          <span class="from">nem</span>
          <span class="date">2019年7月10日</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class information extends Vue {
        voteList = [
            {
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: false,
                selctions: ['是', '否']
            }
        ]
        currentVote = {}
        voteActionList = [{
            name: '选择投票',
            isSelect: true
        }, {
            name: '创建投票',
            isSelect: false
        }]

        swicthVoteAction(index) {
            const list: any = this.voteActionList
            if (list[index].disabled) {
                return
            }
            list.map((item) => {
                index
                item.isSelect = false
                return item
            })
            list[index].isSelect = true
            this.voteActionList = list
        }

        switchVote(index) {
            let list = this.voteList
            this.currentVote = list[index]
            list = list.map((item) => {
                item.isSelect = false
                return item
            })
            list[index].isSelect = true
            this.articleList = list
        }

        created() {
            this.currentVote = this.voteList[0]
        }
    }
</script>

<style scoped lang="less">
  @import "vote.less";
</style>
