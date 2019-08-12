<template>
  <div class="walletSwitchWrap">
    <div class="walletSwitchHead">
      <p class="tit">{{$t('Wallet_management')}}</p>
    </div>
    <div class="walletList">
      <div :class="['walletItem',item.style, item.active &&walletList.length > 1 ? 'active':'','radius']"
           @click="chooseWallet(index)"
           v-for="(item, index) in walletList" :key="index">
        <Row>
          <Col span="15">
            <div>
              <p class="walletName">{{item.name}}</p>
              <p class="walletAmount">{{item.balance ? formatXEMamount(item.balance + ''):0}}&nbsp;<span class="tails">XEM</span>
              </p>
            </div>
          </Col>
          <Col span="9">
            <div @click.stop>
              <p class="walletTypeTxt">{{item.isMultisig ? $t('Public_account') : ''}}</p>
              <div class="options">
                <Poptip placement="bottom">
                  <img src="@/common/img/wallet/moreActive.png">
                  <div slot="content">
                    <p class="optionItem" @click.stop="delWallet(index, item.active)">
                      <i><img src="@/common/img/wallet/delete.png"></i>
                      <span>{{$t('delete')}}</span>
                    </p>
                  </div>
                </Poptip>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>

    <div class="walletMethod">
      <Row>
        <Col span="12">
          <div class="createBtn pointer" @click="toCreate">{{$t('create')}}</div>
        </Col>
        <Col span="12">
          <div class="importBtn pointer" @click="toImport">{{$t('import')}}</div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD:src/views/wallet-management/wallet-switch/WalletSwitch.vue
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {localRead, localSave, formatXEMamount} from '../../../utils/util'
    import {NetworkType} from 'nem2-sdk'
    import {saveLocalWallet} from '@/help/appUtil'
=======
>>>>>>> 67b9d70694798065d212e08886b68e7adc567a19:src/views/wallet/wallet-switch/WalletSwitch.vue
    import './WalletSwitch.less'
    import {NetworkType} from 'nem2-sdk'
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import {localRead, localSave, formatXEMamount} from '@/help/help'

    @Component
    export default class WalletSwitchWrap extends Vue {
        netType = [
            {
                value: NetworkType.MIJIN_TEST,
                label: 'MIJIN_TEST'
            }, {
                value: NetworkType.MAIN_NET,
                label: 'MAIN_NET'
            }, {
                value: NetworkType.TEST_NET,
                label: 'TEST_NET'
            }, {
                value: NetworkType.MIJIN,
                label: 'MIJIN'
            },
        ]
        walletList = []
        currentNetType = this.netType[0].value

        get getWalletList() {
            return this.$store.state.app.walletList
        }

        get getWallet() {
            return this.$store.state.account.wallet
        }

        chooseWallet(walletIndex) {
            let localData = JSON.parse(localRead('wallets'))
            let list = this.getWalletList
            const storeWallet = this.walletList[walletIndex]
            const localWallet = localData[walletIndex]
            list.splice(walletIndex, 1)
            localData.splice(walletIndex, 1)
            list.unshift(storeWallet)
            localData.unshift(localWallet)
            list.map((item, index) => {
                if (index === 0) {
                    item.active = true
                } else {
                    item.active = false
                }
            })
            const account = saveLocalWallet(storeWallet, null, walletIndex)
            this.$store.commit('SET_WALLET', account)
            this.walletList = list
            this.$store.commit('SET_WALLET_LIST', list)
            localSave('wallets', JSON.stringify(localData))
        }

        delWallet(index, current) {
            let list = this.walletList;
            let localData = JSON.parse(localRead('wallets'))
            list.splice(index, 1)
            localData.splice(index, 1)
            if (list.length < 1) {
                this.$store.state.app.isInLoginPage = true
                this.$emit('noHasWallet')
            }
            this.$store.commit('SET_WALLET_LIST', list)
            this.$store.commit('SET_WALLET', this.walletList[0])
            localSave('wallets', JSON.stringify(localData))
            this.$Notice.success({
                title: this['$t']('Delete_wallet_successfully') + '',
            });
            document.body.click()
            this.initWalletList()

        }

        formatXEMamount(text) {
            return formatXEMamount(text)
        }

<<<<<<< HEAD:src/views/wallet-management/wallet-switch/WalletSwitch.vue
=======
        copyObj(obj) {
            const newObj: any = Object.prototype.toString.call(obj) == '[object Array]' ? [] : {};
            for (const key in obj) {
                const value = obj[key];
                if (value && 'object' == typeof value) {
                    //recursive clone
                    newObj[key] = this.copyObj(value);
                } else {
                    newObj[key] = value;
                }
            }
            return newObj;
        }

>>>>>>> 67b9d70694798065d212e08886b68e7adc567a19:src/views/wallet/wallet-switch/WalletSwitch.vue
        initWalletList() {
            const list = this.getWalletList
            list.map((item, index) => {
                if (index === 0) {
                    item.active = true
                } else {
                    item.active = false
                }
            })
            for (let i in list) {
                this.$set(this.walletList, i, list[i])
            }
            if (this.walletList.length > 0) {
                this.$emit('hasWallet')
                this.$store.commit('SET_HAS_WALLET', true)
            } else {
                this.$store.commit('SET_HAS_WALLET', false)
            }
        }

        toImport() {
            this.$emit('toImport')
        }

        toCreate() {
            this.$emit('toCreate')
        }

        @Watch('getWallet')
        onGetWalletChange() {
            this.initWalletList()
        }

        created() {
            this.$store.commit('SET_WALLET', this.getWalletList[0])
            this.initWalletList()
        }
    }
</script>

<style scoped>

</style>
