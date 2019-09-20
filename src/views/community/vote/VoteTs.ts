import PieChart from './PieChart.vue'
import {Component, Vue, Watch} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {alphabet, Message} from '@/config/index.ts'
import {vote} from '@/core/api/logicApi.ts'
import {mapState} from "vuex"
import {formatDate} from '@/core/utils/utils.ts'
import {voteActionConfig, voteFilterConfig, voteSelectionConfig} from "@/config/view/vote";
import {VoteType} from "@/core/model/VoteType";

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
    currentVote: any = {}
    activeAccount: any
    sigleSelection = ''
    currentVoteList = []
    currentVoteFilter = 0
    multiSelectionList = []
    currentTimestamp: any = 0
    showCheckPWDialog = false
    isLoadingConfirmedTx = true
    alphabet = alphabet
    voteFilterList = voteFilterConfig
    spinShow = true
    voteActionList = voteActionConfig
    voteList = []
    selections = []
    offset = 0
    isVoted = true
    voteType = VoteType
    formItem = {
        title: '',
        content: '',
        voteType: 0,
        endtime: formatDate(new Date().valueOf() + 200000000),
        starttime: formatDate(new Date().valueOf()),
        fee: '',
        optionList: voteSelectionConfig
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get address() {
        return this.activeAccount.wallet.address
    }


    swicthVoteAction(index) {
        this.refreshVoteList()
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
        let list = this.currentVoteList
        this.currentVote = list[index]
        list = list.map((item) => {
            item.isSelect = false
            return item
        })
        list[index].isSelect = true
        this.currentVoteList = list
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

    checkEnd(flag) {
        if (flag) {
            const {sigleSelection, address} = this
            const voteId = this.currentVote.id
            const that = this
            vote.addVote({
                address: address,
                voteId: voteId,
                voteDataIds: [sigleSelection]
            }).then((isVoteSuccess) => {
                if (isVoteSuccess) {
                    that.$Notice.destroy()
                    that.$Notice.success({
                        title: this.$t(Message.OPERATION_SUCCESS) + ''
                    })
                }

            })
        }
    }

    sendVote() {
        const {sigleSelection} = this
        if (!sigleSelection) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.INPUT_EMPTY_ERROR) + ''
            })
            return
        }
        this.showCheckPWDialog = true

    }


    refreshVoteList() {
        this.voteList = []
        this.getVoteList()
    }

    getVoteStatus(start, end) {
        const currentTimestamp = new Date().valueOf()
        if (currentTimestamp >= start && currentTimestamp <= end) {
            return 1
        }
        if (currentTimestamp > end) {
            return 3
        }
    }

    getVoteList() {
        const that = this
        vote.list({limit: '500', offset: '0'}).then((res) => {
            const result = JSON.parse(res.rst)
            let voteList = result.rows
            const resultList = voteList.map((item) => {
                item.vote = 'vote'
                item.deadline = formatDate(item.endtime)
                item.startTimestamp = item.starttime
                item.endTimestamp = item.endtime
                item.isMultiple = item.type == 1
                item.voteStatus = that.getVoteStatus(item.starttime, item.endtime)
                item.isSelect = false
                item.max = 1
                item.isMultiple = false
                return item

            })
            that.currentVoteList = resultList
            if (!that.currentVote.id) {
                that.currentVoteList[0].isSelect = true
                that.currentVote = that.currentVoteList[0]
            }
        })
    }

    submitCreatVote() {
        const {address, publicKey} = this
        const that = this
        const {title, content, voteType, endtime, starttime, optionList} = this.formItem
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
            that.$Notice.destroy()
            that.$Notice.success({
                title: this.$t(Message.SUCCESS) + ''
            })
        })
        that.$Notice.destroy()
        this.$Notice.success({
            title: this.$t(Message.OPERATION_SUCCESS) + ''
        })
    }

    checkForm() {
        const {title, content, voteType, endtime, starttime, optionList} = this.formItem
        if (title === '' || title.trim() === '' || content === '' || content.trim() === '' || optionList.length < 1 || endtime == '' || endtime.trim() == '' || starttime == '' || starttime.trim() == '') {
            this.showErrorNotice(Message.INPUT_EMPTY_ERROR)
            return false
        }
    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: this.$t(text) + ''
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

    @Watch('currentVote', {immediate: true, deep: true})
    getCurrentVoteInfo() {
        const that = this
        const {address} = this
        const voteId = this.currentVote.id
        vote.listData({voteid: voteId}).then((voteItemResult => {
            const voteResult = JSON.parse(voteItemResult.rst)
            const voteDetail = voteResult.rows
            that.selections = voteDetail.map(item => {
                item.name = item.description
                item.value = item.length
                return item
            })

        }))
        vote.userAlready({
            limit: '1',
            offset: '0',
            voteId: voteId,
            address: address
        }).then((userVoteResult) => {
            that.isVoted = JSON.parse(userVoteResult.rst).total !== 0
            that.spinShow = false
        })
    }

    automaticLoadingVote() {
        // const allHeight = this.$refs.voteListContainer['scrollHeight']
        // const scrollHeight = this.$refs.voteListContainer['offsetHeight'] + this.$refs.voteListContainer['scrollTop']
        // if (allHeight <= scrollHeight) {
        //     this.getVoteList()
        // }
    }

    mounted() {
        this.currentVoteFilter = this.voteFilterList[0].value
        this.currentTimestamp = Number((new Date()).valueOf() / 1000).toFixed(0)
        this.currentVoteList = this.voteList
    }

    created() {
        this.getVoteList()
    }
}

