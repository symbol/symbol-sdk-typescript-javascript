<template>
  <div class="vote_container radius">
    <div class="top_button">
      <span
              @click="swicthVoteAction(index)"
              :class="['transaction_btn',t.isSelect?'selected_button':'', t.disabled?'disabled_button':'','pointer']"
              v-for="(t,index) in voteActionList">
        {{$t(t.name)}}
        </span>
      <Select v-show="voteActionList[0].isSelect" class="vote_filter" v-model="currentVoteFilter" style="width:100px">
        <Option class="pointer" v-for="(item,index) in voteFilterList" :value="item.value" :key="index">
          {{ $t(item.label)}}
        </Option>
      </Select>
    </div>

    <div class="show_exists_vote_list" v-show="voteActionList[0].isSelect">
      <div class="bottom_vote_list">
        <div class="left  scroll left_article_list">

          <div @click="switchVote(index)" v-for="(v,index) in currentVoteList"
               :class="['article_summary_item',v.isSelect?'selected':'','pointer']">
            <div class="left left_info">
              <div class="title overflow_ellipsis">{{v.title}}
              </div>
              <div class="summary overflow_ellipsis">{{v.content}}</div>
              <div class="other_info">
                <span class="tag">{{$t('business')}}</span>
                <span class="from">nem</span>
                <span class="date">2019/7/10</span>
              </div>
            </div>
            <div class="right right_duration_flag">
              <span v-if='v.voteStatus == 1'
                    class='blue'>{{$t('processing')}}</span>
              <span v-if='v.voteStatus == 2' class='orange'>{{$t('already_involved')}}</span>
              <span v-if='v.voteStatus == 3' class='red'>{{$t('finished')}}</span>
            </div>
          </div>
        </div>

        <div class="right_article_detail radius  right">
          <div class="right_container scroll">
            <div class="initor">
              <span class="blue">{{$t('initiation_address')}}</span>
              <span>  f65sf5s5af65as6df5sa5f6s5f6s5af65sa6f5s6af5s6a5f6f</span>
            </div>
            <div class="vote_address">
              <span class="blue">{{$t('voting_address')}}</span>
              <span>ad5as4d5a4d5as4d5as5d45asd54sa5d45as4d5as4d5a</span>
            </div>
            <div class="title">{{currentVote.title}}</div>
            <div class="date"><span class="red">{{$t('deadline')}}</span><span>2019年7月10日 16:33</span></div>
            <div class="content">{{currentVote.title}}</div>
            <div class="selection">
              <RadioGroup v-model="sigleSelection" v-if="!currentVote.isMultiple">
                <Radio v-for="i in currentVote.selctions" :label="i.name"></Radio>
              </RadioGroup>
              <CheckboxGroup v-model="multiSelectionList" v-else>
                <Checkbox v-for="i in currentVote.selctions" :label="i.name"></Checkbox>
              </CheckboxGroup>
            </div>
            <div class="pie_chart">
              <PieChart :currentVote="currentVote"></PieChart>
            </div>
            <div @click="sendVote" class="click_to_vote pointer">
              {{$t('confirm_vote')}}
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="create_vote scroll" v-show="!voteActionList[0].isSelect">

      <div class="vote_creating_content">
        <div class="vote_title">
          <span class="title">{{$t('title')}}</span>
          <span class="value radius"><input :placeholder="$t('please_enter_a_voting_title')" type="text"></span>
        </div>
        <div class="vote_describle">
          <span class="title">{{$t('description')}}</span>
          <span class="value radius">
          <textarea :placeholder="$t('about_voting_content_description')" class="scroll" name="" id="" cols="95"
                    rows="3"></textarea>
        </span>
        </div>
        <div class="vote_selections">
          <span class="title">{{$t('option')}}</span>
          <span class="selection_list right">
          <div class="list_cloumn" v-for="(s,index) in selectionList">
            <span class="value radius">
              <input :value="s" type="text"/>
             </span>
            <span class="button_content">
              <img src="../../../assets/images/community/vote/voteAdd.png" class="pointer" @click="addSelection()"
                   alt="">
              <img src="../../../assets/images/community/vote/voteDelete.png" class="pointer" v-if="index !== 0"
                   @click="deleteSelection(index)" alt="">
            </span>
          </div>
        </span>

        </div>

        <div class="vote_vote_type">
          <RadioGroup v-model="voteType">
            <Radio class="vote_mul" :label="$t('multiple_selection')"></Radio>
            <Radio class="vote_single" :label="$t('radio')"></Radio>
          </RadioGroup>
        </div>
        <div class="vote_deadline">
          <span class="title">{{$t('deadline')}}</span>
          <span class="value radius">
          <input type="text" :value="deadline" :placeholder="$t('enter_the_date_for_example')+'2019-12-28 14:57'">

            <span class="select_date pointer">
              <div class="date_container pointer">
                <div class="month_value pointer">
                <img src="../../../assets/images/monitor/market/marketCalendar.png" alt="">
              </div>
              <div class="date_selector pointer">
                <DatePicker class="pointer" @on-change="changeCurrentMonth" type="datetime" placeholder=""
                            :value="currentMonth"
                            style="width: 70px"></DatePicker>
              </div>
              </div>

            </span>
        </span>
        </div>
        <div class="vote_fee">
          <span class="title">{{$t('fee')}}</span>
          <span class="value radius">
          <input placeholder="0.050000" type="text">
          <span class="right">XEM</span>
        </span>
        </div>
        <div class="tips red right">
          {{$t('the_default_is')}}:0.05000XEM，{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
        </div>

        <div class="create_button pointer">
          {{$t('create')}}
        </div>
      </div>

    </div>

    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import PieChart from './PieChart.vue';
    import CheckPWDialog from '../../../components/checkPW-dialog/CheckPWDialog.vue'

    @Component({
            components: {
                PieChart,
                CheckPWDialog
            }
        }
    )
    export default class information extends Vue {
        currentTimestamp: any = 0
        showCheckPWDialog = false
        currentVoteFilter = {}
        voteType = ''
        deadline = ''
        voteFilterList = [
            {
                value: 0,
                label: 'all'
            },
            {
                value: 1,
                label: 'processing'
            },
            {
                value: 2,
                label: 'already_involved'
            },
            {
                value: 3,
                label: 'finished'
            }
        ]
        selectionList = ['1', '2']
        currentVoteList = []
        voteList = [
            {
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                startTimestamp: '1537333994',
                endTimestamp: '1571462284',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: false,
                voteStatus: 3,
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
            }, {
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                startTimestamp: '1334812684',
                endTimestamp: '1571462284',
                isInvolved: false,
                voteStatus: 1,
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
            }, {
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                isInvolved: true,
                voteStatus: 2,
                startTimestamp: '1537333994',
                endTimestamp: '1555650794',
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
            }, {
                voteStatus: 2,
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: 'niniinnininni目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                startTimestamp: '1555651084',
                isInvolved: false,
                endTimestamp: '1366348684',
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
            }, {
                voteStatus: 1,
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                isInvolved: true,
                startTimestamp: '1537333994',
                endTimestamp: '1555650794',
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
            }, {
                voteStatus: 3,
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                isInvolved: true,
                startTimestamp: '1537333994',
                endTimestamp: '1566191594',
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
            }, {
                voteStatus: 1,
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                isInvolved: false,
                startTimestamp: '1537333994',
                endTimestamp: '1566191594',
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
            }, {
                voteStatus: 2,
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                isInvolved: false,
                startTimestamp: '1537333994',
                endTimestamp: '1555650794',
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
            }, {
                voteStatus: 1,
                initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
                vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
                title: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                deadline: '2019-05-21 14:00',
                isInvolved: false,
                content: '目前在模式下无法读取加密消息并捕获。这是不能接受的条件。开发人员应该修复它。你同意吗?',
                isMultiple: true,
                startTimestamp: '1537333994',
                endTimestamp: '1555650794',
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
        ]
        currentMonth = ''
        currentVote = {}
        voteActionList = [
            {
                name: 'choose_to_vote',
                isSelect: true
            }, {
                name: 'create_a_vote',
                isSelect: false
            }
        ]
        sigleSelection = ''
        multiSelectionList = []

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
            this.selectionList.splice(index, 1)
        }

        changeCurrentMonth(e) {
            this.deadline = e
        }


        closeCheckPWDialog() {
            console.log('......closeCheckPWDialog')
        }

        checkEnd(boolean) {
            console.log(boolean)
        }

        sendVote() {
            this.showCheckPWDialog = true
        }

        @Watch('currentVoteFilter')
        onCurrentVoteFilterChange() {
            if(this.currentVoteFilter == 0 ){
                this.currentVoteList = this.voteList
                return
            }
            let list = this.voteList
            this.currentVoteList = []
            list.map((item) => {
                if (item.voteStatus == this.currentVoteFilter) {
                    this.currentVoteList.push(item)
                }
            })
        }

        created() {
            this.currentVote = this.voteList[0]
            this.currentVoteFilter = this.voteFilterList[0].value
            this.currentTimestamp = Number((new Date()).valueOf() / 1000).toFixed(0)
            this.currentVoteList = this.voteList
        }
    }
</script>

<style scoped lang="less">
  @import "vote.less";
</style>
