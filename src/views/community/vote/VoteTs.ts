import PieChart from './PieChart.vue'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {voteFilterList, alphabet, voteSelectionList, voteActionList, voteType, Message} from '@/config/index.ts'
import {vote} from '@/core/api/logicApi.ts'
import {mapState} from "vuex"

@Component({
        components: {
            PieChart,
            CheckPWDialog
        },
        computed: {
            ...mapState({
                activeAccount: 'account',
            })
        }
    }
)
export class VoteTs extends Vue {
    currentVote = {}
    activeAccount: any
    sigleSelection = ''
    currentVoteList = []
    currentVoteFilter = 0
    multiSelectionList = []
    currentTimestamp: any = 0
    showCheckPWDialog = false
    isLoadingConfirmedTx = true
    alphabet = alphabet
    voteFilterList = voteFilterList
    voteActionList = voteActionList
    voteList = [
        // TODO data structure
        {
            initiator: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN',
            vote: 'NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA',
            title: 'Encrypted messages cannot currently be read and captured in mode. This is an unacceptable condition. The developer should fix it. Do you agree?',
            endtime: '2019-05-21 14:00',
            startTimestamp: '1537333994',
            endTimestamp: '1571462284',
            content: 'Encrypted messages cannot currently be read and captured in mode. This is an unacceptable condition. The developer should fix it. Do you agree?',
            isMultiple: true,
            voteStatus: 3,
            selctions: [
                {
                    name: 'yes',
                    value: 99
                }, {
                    name: 'no',
                    value: 59
                },
            ],
            isSelect: true,
            max: 2,
        }
    ]
    voteType = voteType
    formItem = {
        title: 'wwwwwwwwwwwvvvvvvvvvvvvvvvvwwwwwwwwww',
        content: 'wwwwwwwwwwwvvvvvvvvvvvvvvvvwwwwwwwwww',
        voteType: 0,
        endtime: '2019-12-28 14:57',
        starttime: '2019-12-28 14:57',
        fee: '',
        optionList: voteSelectionList
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get address() {
        return this.activeAccount.wallet.address
    }

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
        this.formItem.optionList.push({
            description: '3'
        })
    }

    deleteSelection(index) {
        this.formItem.optionList.splice(index, 1)
    }

    updateCurrentMonth(e) {
        this.formItem.endtime = e
    }

    updateStartTime(e) {
        this.formItem.starttime = e
    }

    closeCheckPWDialog() {
        // TODO
    }

    checkEnd(boolean) {
    }

    sendVote() {
        this.showCheckPWDialog = true
    }

    getVoteList() {
        vote.list({limit: '20', offset: '0'}).then((res) => {
            console.log(res)
        })
    }

    submitVoting() {
        //       address
        //         voteId
        //         voteDataIds
    }

    submitCreatVote() {
        const {address, publicKey} = this
        const {title, content, voteType, endtime, starttime, fee, optionList} = this.formItem
        const voteParam = {
            title,
            address,
            initiator: publicKey,
            content,
            type: Number(voteType),
            timestamp: new Date().valueOf(),
            endtime: new Date(endtime).valueOf(),
            starttime: new Date(starttime).valueOf(),
            voteDataDOList: optionList
        }
        vote.saveVote({
            vote: voteParam
        }).then(() => {
            this.$Notice.success({
                title: Message.SUCCESS
            })
        })
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

    mounted() {
        this.getVoteList()
        this.currentVote = this.voteList[0]
        this.currentVoteFilter = this.voteFilterList[0].value
        this.currentTimestamp = Number((new Date()).valueOf() / 1000).toFixed(0)
        this.currentVoteList = this.voteList
    }
}

