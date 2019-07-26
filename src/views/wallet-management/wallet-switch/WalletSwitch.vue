<template>
  <div class="walletSwitchWrap">
    <div class="walletSwitchHead">
      <p class="tit">{{$t('Wallet_management')}}</p>
    </div>

    <div class="walletList">
      <div :class="['walletItem', item.active ? 'active':'',item.style,'radius']"
           @click="chooseWallet(index)"
           v-for="(item, index) in walletList" :key="index">
        <Row>
          <Col span="15">
            <div>
              <p class="walletName">{{item.name}}</p>
              <p class="walletAmount">{{item.balance}}&nbsp;<span class="tails">XEM</span></p>
            </div>
          </Col>
          <Col span="9">
            <div @click.stop>
              <p class="walletTypeTxt">{{$t('Public_account')}}</p>
              <div class="options">
                <Poptip placement="bottom">
                  <img src="../../../assets/images/wallet-management/moreActive.png">
                  <!--                  <img src="../../../assets/images/wallet-management/more.png" v-else>-->
                  <div slot="content">
                    <p class="optionItem" @click.stop="delWallet(index, item.active)">
                      <i><img src="../../../assets/images/wallet-management/delete.png"></i>
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
          <div class="createBtn" @click="toCreate">{{$t('create')}}</div>
        </Col>
        <Col span="12">
          <div class="importBtn" @click="toImport">{{$t('import')}}</div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {localRead, localSave} from '../../../utils/util'
    import {NetworkType} from 'nem2-sdk'
    import './WalletSwitch.less'

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
            let walletList = this.$store.state.app.walletList
            walletList =  walletList.map((item,index)=>{
                item.style = 'walletItem_bg_' + index % 3
                return item
            })

            return walletList
        }

        get getWallet() {
            return this.$store.state.account.wallet
        }

        chooseWallet(walletIndex) {

            let list = this.getWalletList
            const storeWallet = this.walletList[walletIndex]
            list.splice(walletIndex, 1)
            list.unshift(storeWallet)
            this.$store.commit('SET_WALLET', storeWallet)
            list.map((item, index) => {
                if (index === 0) {
                    item.active = true
                } else {
                    item.active = false
                }
            })
            this.localKey(storeWallet.name, walletIndex, storeWallet.address, storeWallet.networkType, storeWallet.balance)
            this.walletList = list
            this.$store.commit('SET_WALLET_LIST', list)
            localSave('wallets', JSON.stringify(list))
        }

        localKey(walletName, index, address, netType, balance = 0) {
            let localData: any[] = []
            let isExist: boolean = false
            try {
                localData = JSON.parse(localRead('wallets'))
            } catch (e) {
                localData = []
            }
            let saveData = {
                name: walletName,
                ciphertext: localData[index].ciphertext,
                iv: localData[index].iv,
                networkType: Number(netType),
                address: address,
                balance: balance
            }
            saveData = Object.assign(saveData, this.getWallet)
            delete saveData['active']
            for (let i in localData) {
                if (localData[i].address === address) {
                    localData[i] = saveData
                    isExist = true
                }
            }
            if (!isExist) localData.unshift(saveData)
            localSave('wallets', JSON.stringify(localData))
        }

        delWallet(index, current) {
            let list = this.walletList;
            list.splice(index, 1)
            if (list.length < 1) {
                this.$emit('noHasWallet')
            } else {
                if (current) {
                    this.$store.commit('SET_WALLET', this.walletList[0])
                }
            }
            this.$store.commit('SET_WALLET_LIST', list)
            localSave('wallets', JSON.stringify(list))
            this.$Notice.success({
                title: this['$t']('Wallet_management') + '',
                desc: this['$t']('Delete_wallet_successfully') + '',
            });
            document.body.click()
            this.initWalletList()

        }

        copyObj(obj) {
            const newObj: any = Object.prototype.toString.call(obj) == '[object Array]' ? [] : {};
            for (const key in obj) {
                const value = obj[key];
                if (value && 'object' == typeof value) {
                    //递归clone
                    newObj[key] = this.copyObj(value);
                } else {
                    newObj[key] = value;
                }
            }
            return newObj;
        }

        initWalletList() {
            const list = this.copyObj(this.getWalletList)
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
            console.log(this.$store.state.account.wallet)
        }
    }
</script>

<style scoped>

</style>
