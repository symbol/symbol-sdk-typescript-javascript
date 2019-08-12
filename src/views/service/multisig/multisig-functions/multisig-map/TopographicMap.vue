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
    import {copyTxt} from '@/help/help.ts'
   import {Message} from "@/config/index"
    import {Component, Vue} from 'vue-property-decorator'
    import {multisigInterface} from '@/interface/sdkMultisig'
    import multisignSelfIcon from '@/common/img/service/multisig/multisignSelfIcon.png'
    import multisignCosignerIcon from '@/common/img/service/multisig/multisignCosignerIcon.png'
    import multisignMultisignerIcon from '@/common/img/service/multisig/multisignMultisignerIcon.png'

    @Component
    export default class LineChart extends Vue {
        dom: any = {};
        spinShow = true
        notMultisigNorCosigner = true
        option = {
            tooltip: {
                alwaysShowContent: true,
                padding: 0,
                position: 'right',
                formatter: (params: any, copyIcon) => {
                    if (params.dataType == 'edge') {
                        return
                    }
                    const template = `<div class="tooltip" >
                                        <div>${params.data.address.address}</div>
<!--                                        <div>publickey:${params.data.publicKey}</div>-->
                                    </div>`
                    return template
                }
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    left: 60,
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 70,
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    edgeSymbol: ['none', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        normal: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    data: [],
                    links: [],
                    lineStyle: {
                        normal: {
                            width: 2,
                            curveness: 0,
                            color: '#4DC2BF',
                            type: 'dotted'
                        }
                    }
                }
            ]
        };

        mounted() {
            this.refresh()
        }

        async refresh() {
            const that = this
            await this.getMultisigInfo()
            if (this.notMultisigNorCosigner) {
                return
            }

            this.dom = echarts.init(this.$refs.dom)
            await this.dom.on('click', function (params) {
                that.copyAddress(params)
            })
            this.dom.setOption(that.option)
            window.onresize = this.dom.resize

        }

        copyAddress(params) {
            const that = this
            copyTxt(params.data.address.address).then(() => {
                that.$Notice.destroy()
                that.$Notice.success(
                    {
                        title: this.$t(Message.COPY_SUCCESS) + ''
                    }
                )
            })
        }


        async getMultisigInfo() {
            const that = this
            const {address, publicAccount} = this.$store.state.account.wallet
            const {node} = this.$store.state.account

            let cosignerList = []
            let multisigList = []
            let allAccountList = []
            let links = []
            const xAxisDistance = 30
            await multisigInterface.getMultisigAccountInfo({
                address,
                node
            }).then((result) => {
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
                const multisigInfo = result.result.multisigInfo
                // multisig nodes
                multisigList = multisigInfo.multisigAccounts.map((item, index) => {
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
                cosignerList = multisigInfo.cosignatories.map((item, index) => {
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
                that.notMultisigNorCosigner = allAccountList.length == 1 ? true : false
                that.option.series[0].data = allAccountList
                that.option.series[0].links = links
            }).catch(e => console.log(e))
        }

        async created() {
            this.refresh()
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
