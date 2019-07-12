<template>
  <div class="vote_container">
    <div class="top_button">
      <span
              @click="swicthVoteAction(index)"
              :class="['transaction_btn',t.isSelect?'selected_button':'', t.disabled?'disabled_button':'']"
              v-for="(t,index) in voteActionList">
        {{t.name}}
        </span>
      <Select v-show="voteActionList[0].isSelect" class="vote_filter" v-model="currentVoteFilter" style="width:100px">
        <Option v-for="(item,index) in voteFilterList" :value="item.value" :key="index">{{ item.label }}</Option>
      </Select>
    </div>

    <div class="show_exists_vote_list" v-show="voteActionList[0].isSelect">
      <div class="bottom_vote_list">
        <div class="left  hide_scroll left_article_list">

          <div @click="switchVote(index)" v-for="(a,index) in voteList"
               :class="['article_summary_item',a.isSelect?'selected':'']">
            <div class="left left_info">
              <div class="title overflow_ellipsis">{{a.title}}
              </div>
              <div class="summary overflow_ellipsis">{{a.content}}</div>
              <div class="other_info">
                <span class="tag">商业</span>
                <span class="from">nem</span>
                <span class="date">2019年7月10日</span>
              </div>
            </div>
            <div class="right right_duration_flag">
              <span :class="index % 2 == 0 ? 'red':'blue'">已结束</span>
            </div>
          </div>
        </div>

        <div class="right_article_detail hide_scroll right">
          <div class="initor">
            <span class="blue">发起地址</span>
            <span>  f65sf5s5af65as6df5sa5f6s5f6s5af65sa6f5s6af5s6a5f6f</span>
          </div>
          <div class="vote_address">
            <span class="blue">投票地址</span>
            <span>ad5as4d5a4d5as4d5as5d45asd54sa5d45as4d5as4d5a</span>
          </div>
          <div class="title">{{currentVote.title}}</div>
          <div class="date"><span class="red">截止时间</span><span>2019年7月10日 16:33</span></div>
          <div class="content">{{currentVote.title}}</div>
          <div class="selection">
            <RadioGroup v-model="animal" v-if="!currentVote.isMultiple">
              <Radio v-for="i in currentVote.selctions" :label="i.name"></Radio>
            </RadioGroup>
            <CheckboxGroup v-model="fruit" v-else>
              <Checkbox v-for="i in currentVote.selctions" :label="i.name"></Checkbox>
            </CheckboxGroup>
          </div>
          <div class="pie_chart">
            <PieChart :currentVote="currentVote"></PieChart>
          </div>
        </div>
      </div>
    </div>
    <div class="create_vote hide_scroll" v-show="!voteActionList[0].isSelect">

      <div class="vote_creating_content">
        <div class="vote_title">
          <span class="title">标题</span>
          <span class="value radius"><input placeholder="请输入投票标题" type="text"></span>
        </div>
        <div class="vote_describle">
          <span class="title">描述</span>
          <span class="value radius">
          <textarea placeholder="关于投票内容描述" class="hide_scroll" name="" id="" cols="95" rows="3"></textarea>
        </span>
        </div>
        <div class="vote_selections">
          <span class="title">选项</span>
          <span class="selection_list right">
          <div v-for="(s,index) in selectionList">
            <span class="value radius">
              <input :value="s" type="text"/>
             </span>
            <span class="button_content">
              <img src="../../../assets/images/community/vote/voteAdd.png" @click="addSelection()" alt="">
            <img src="../../../assets/images/community/vote/voteDelete.png" v-if="index !== 0" @click="deleteSelection(index)" alt="">
            </span>

          </div>
        </span>

        </div>

        <div class="vote_vote_type">
          <RadioGroup v-model="voteType">
            <Radio class="vote_mul" label="多选"></Radio>
            <Radio class="vote_single" label="单选"></Radio>
          </RadioGroup>
        </div>
        <div class="vote_deadline">
          <span class="title">截止时间</span>
          <span class="value radius">
          <input type="text" :value="deadline" placeholder="输入日期 ISO格式有效日期YYYY-MM DD HH:mm，例如：2019-12-28 14:57">

            <span class="select_date">
              <div class="month_value">
                <img src="../../../assets/images/monitor/market/marketCalendar.png" alt="">
              </div>
              <div class="date_selector">
                <DatePicker @on-change="changeCurrentMonth" type="datetime" placeholder="" :value="currentMonth"
                            style="width: 70px"></DatePicker>
              </div>
            </span>
        </span>
        </div>
        <div class="vote_fee">
          <span class="title">费用</span>
          <span class="value radius">
          <input placeholder="0.050000" type="text">
          <span class="right">XEM</span>
        </span>
        </div>
        <div class="tips red right">默认为：0.05000XEM，设置的费用越多，处理优先级越高</div>

        <div class="create_button">
          创建
        </div>
      </div>

    </div>

    <CheckPWDialog :showCheckPWDialog="true" @closeCheckPWDialog="closeCheckPWDialog" @checkEnd="checkEnd"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import PieChart from './PieChart.vue';
    import CheckPWDialog from '../../../components/checkPW-dialog/checkPWDialog'

    @Component({
            components: {
                PieChart,
                CheckPWDialog
            }
        }
    )
    export default class information extends Vue {
        currentVoteFilter = {}
        voteType = '多选'
        deadline = ''
        voteFilterList = [
            {
                value: 0,
                label: '全部'
            },
            {
                value: 1,
                label: '进行中'
            },
            {
                value: 2,
                label: '已参与'
            },
            {
                value: 3,
                label: '已结束'
            }
        ]
        selectionList = ['1','2']
        voteList = [
            {
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                selctions: [
                    {
                        name: '是',
                        value: 99
                    }, {
                        name: '否',
                        value: 59
                    }
                ],
                isSelect: false,
                max: 2,
            },
            {
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: false,
                selctions: [
                    {
                        name: '是',
                        value: 19
                    }, {
                        name: '否',
                        value: 59
                    }
                ],
                isSelect: false,
                max: 1,
            }, {
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                selctions: [
                    {
                        name: '是',
                        value: 99
                    }, {
                        name: '否',
                        value: 29
                    }
                ],
                isSelect: false,
                max: 2,
            },
            {
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: false,
                selctions: [
                    {
                        name: '是',
                        value: 59
                    }, {
                        name: '否',
                        value: 59
                    }
                ],
                isSelect: false,
                max: 1,
            },
        ]
        currentVote = {}
        voteActionList = [
            {
                name: '选择投票',
                isSelect: true
            }, {
                name: '创建投票',
                isSelect: false
            }
        ]
        animal = '爪哇犀牛'
        fruit = ['苹果']

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
            this.voteList = list
        }

        addSelection() {
            this.selectionList.push('')
        }
        deleteSelection(index) {
            console.log(index)
            console.log(this.selectionList)
            this.selectionList.splice(index ,1)
            console.log(this.selectionList)
        }
        changeCurrentMonth(e) {
            this.deadline = e
        }
        created() {
            this.currentVote = this.voteList[0]
            this.currentVoteFilter = '全部'
        }
        closeCheckPWDialog() {
            console.log('......closeCheckPWDialog')
        }
        checkEnd(boolean){
            console.log(boolean)
        }
    }
</script>

<style scoped lang="less">
  @import "vote.less";
</style>
