import PieChart from './PieChart.vue'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

@Component({
        components: {
            PieChart,
            CheckPWDialog
        }
    }
)
export class VoteTs extends Vue {
    voteType = ''
    deadline = ''
    currentVote = {}
    currentMonth = ''
    sigleSelection = ''
    currentVoteList = []
    currentVoteFilter = {}
    multiSelectionList = []
    currentTimestamp: any = 0
    showCheckPWDialog = false
    isLoadingConfirmedTx = true
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
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
    selectionList = [
        {
            value: '1'
        }, {
            value: '2'
        }
    ]
    voteList = [
        // {
        //     initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
        //     vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
        //     title: 'Encrypted messages cannot currently be read and captured in mode. This is an unacceptable condition. The developer should fix it. Do you agree?',
        //     deadline: '2019-05-21 14:00',
        //     startTimestamp: '1537333994',
        //     endTimestamp: '1571462284',
        //     content: 'Encrypted messages cannot currently be read and captured in mode. This is an unacceptable condition. The developer should fix it. Do you agree?',
        //     isMultiple: true,
        //     voteStatus: 3,
        //     selctions: [
        //         {
        //             name: 'yes',
        //             value: 99
        //         }, {
        //             name: 'no',
        //             value: 59
        //         },
        //     ],
        //     isSelect: true,
        //     max: 2,
        // }

    ]

    voteActionList = [
        {
            name: 'choose_to_vote',
            isSelect: true
        }, {
            name: 'create_a_vote',
            isSelect: false
        }
    ]


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
        console.log(this.selectionList)
        this.selectionList.push({
            value: ''
        })
    }

    deleteSelection(index) {
        this.selectionList.splice(index, 1)
    }

    changeCurrentMonth(e) {
        this.deadline = e
    }


    closeCheckPWDialog() {
        // TODO
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
        if (this.currentVoteFilter == 0) {
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
        // this.currentVote = this.voteList[0]
        this.currentVoteFilter = this.voteFilterList[0].value
        this.currentTimestamp = Number((new Date()).valueOf() / 1000).toFixed(0)
        this.currentVoteList = this.voteList
    }
}

