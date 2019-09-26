<template>
  <div class="topo_graph_container">
    <div v-if="notMultisigNorCosigner" class="not_Multisig_Nor_Cosigner">
      {{$t('There_are_no_more_accounts_under_this_account_or_cosigner')}}
    </div>
    <div class="topo" id="id" ref="dom"></div>
  </div>

</template>

<script lang="ts">
    import echarts from 'echarts'
    import {mapState} from 'vuex'
    import {Message} from "@/config/index.ts"
    import {echarts as echartsConfigure} from "@/config/view/echarts"
    import {copyTxt} from '@/core/utils/utils.ts'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import multisignSelfIcon from '@/common/img/service/multisig/multisignSelfIcon.png'
    import multisignCosignerIcon from '@/common/img/service/multisig/multisignCosignerIcon.png'
    import multisignMultisignerIcon from '@/common/img/service/multisig/multisignMultisignerIcon.png'
    import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs"

    @Component({
        computed: {
            ...mapState({
                activeAccount: 'account',
                app: 'app',
            })
        }
    })
    export default class LineChart extends Vue {
        dom: any = {}
        activeAccount: any
        app: any
        spinShow = true
        notMultisigNorCosigner = true
        option = echartsConfigure.multisigMapOption

        get address() {
            return this.activeAccount.wallet.address
        }

        get publicAccount() {
            return this.activeAccount.wallet.publicAccount
        }

        get node() {
            return this.activeAccount.node
        }

        get multisigLoading() {
          return this.app.multisigLoading
        }

        get multisigAccountInfo() {
            return this.activeAccount.multisigAccountInfo[this.address]
        }

        copyAddress(params) {
            const that = this
            if (!params.data.address) return
            copyTxt(params.data.address.address).then(() => {
                that.$Notice.destroy()
                that.$Notice.success(
                    {
                        title: this.$t(Message.COPY_SUCCESS) + ''
                    }
                )
            })
        }

        getMultisigInfo() {
            const that = this
            const {address, publicAccount, node, multisigAccountInfo} = this
            if (!multisigAccountInfo) {
                this.notMultisigNorCosigner = true
                this.option.series[0].data = []
                this.option.series[0].links = []
                this.dom = echarts.init(this.$refs.dom)
                this.dom.setOption(this.option)
                return
            }
            const multisigInfo = multisigAccountInfo
            let cosignerList = []
            let multisigList = []
            let allAccountList = []
            let links = []
            const xAxisDistance = 30
            //self
            const selfNode = {
                name: 'self',
                x: 0,
                y: 100,
                symbol: 'image://' + multisignSelfIcon,
                ...publicAccount,
                itemStyle: {
                    color: '#F3875B'
                }
            }
            // multisigApi nodes
            multisigList = multisigInfo.multisigAccounts.map((item: any, index: number) => {
                item.name = 'm-' + index
                item.x = index * xAxisDistance
                item.y = 150
                item.symbol = 'image://' + multisignCosignerIcon
                item.itemStyle = {color: '#586D87'}
                links.push({
                    source: 'self',
                    target: item.name
                })
                return item
            })
            // cosigner nodes
            cosignerList = multisigInfo.cosignatories.map((item: any, index: number) => {
                item.name = 'c-' + index
                item.x = index * xAxisDistance
                item.y = 50
                item.symbol = 'image://' + multisignMultisignerIcon
                item.itemStyle = {color: 'rgba(77,194,191,1)'}
                links.push({
                    source: item.name,
                    target: 'self'
                })
                return item

            })

            allAccountList = [...multisigList, selfNode, ...cosignerList]
            this.notMultisigNorCosigner = allAccountList.length == 1 ? true : false
            this.option.series[0].data = allAccountList
            this.option.series[0].links = links

            if (this.notMultisigNorCosigner) {
                return
            }

            this.dom = echarts.init(this.$refs.dom)
            this.dom.on('click', function (params) {
                that.copyAddress(params)
            })
            this.dom.setOption(this.option)
            window.onresize = this.dom.resize
        }

        @Watch('address')
        onAddressChange(newAddress, oldAddress) {
            if (newAddress && newAddress !== oldAddress) {
                const waitForIt = () => {
                  if (newAddress && !this.multisigAccountInfo && this.multisigLoading) {
                      setTimeout(() => {
                        waitForIt()
                      }, 1000)
                      return
                  }
                  this.getMultisigInfo()
                }
                waitForIt()
            }
        }

        mounted() {
            this.getMultisigInfo()
        }
    }
</script>
<style scoped lang="less">
  .topo_graph_container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .topo {
    width: 100%;
    height: 500px;
    position: absolute;
    top: 100px;
    left: 0;
  }

  .not_Multisig_Nor_Cosigner {
    font-size: 30px;
    background-color: transparent;

  }

</style>
