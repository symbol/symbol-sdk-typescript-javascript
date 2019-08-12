<template>
  <div class="mnemonicDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="mnemonicDialogCancel">
      <div slot="header" class="mnemonicDialogHeader">
        <span class="title">{{$t('export_mnemonic')}}</span>
      </div>
      <div class="mnemonicDialogBody">
        <div class="steps" v-if="stepIndex != 4">
          <span :class="['stepItem',stepIndex == 0?'active':'']">{{$t('input_password')}}</span>
          <span :class="['stepItem',stepIndex == 1?'active':'']">{{$t('backup_prompt')}}</span>
          <span :class="['stepItem',stepIndex == 2?'active':'']">{{$t('backup_mnemonic')}}</span>
          <span :class="['stepItem',stepIndex == 3?'active':'']">{{$t('confirm_backup')}}</span>
        </div>
        <div class="stepItem1" v-if="stepIndex == 0">
          <Form :model="wallet">
            <FormItem>
              <Input v-model="wallet.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem>
              <Button type="success" @click="exportMnemonic">{{$t('next')}}
                <Icon type="ios-arrow-round-forward"/>
              </Button>
            </FormItem>
          </Form>
        </div>
        <div class="stepItem2" v-if="stepIndex == 1">
          <div class="step2Txt">
            <Row>
              <Col span="9">
                <div class="imgDiv">
                  <div class="step2Img">
                    <img src="@/common/img/wallet/Step2Img.png">
                  </div>
                </div>
              </Col>
              <Col span="15">
                <p class="tit">{{$t('getting_a_mnemonic_equals_ownership_of_a_wallet_asset')}}</p>
                <div class="ul1">
                  <p class="ul1Tit"><span class="point"></span> {{$t('backup_mnemonic')}}</p>
                  <p class="ul1Txt">
                    {{$t('use_paper_and_pen_to_correctly_copy_mnemonics_If_your_phone_is_lost_stolen_or_damaged_mnemonic_will_restore_your_assets')}}</p>
                </div>
                <div class="ul2">
                  <p class="ul2Tit"><span class="point"></span> {{$t('offline_storage')}}</p>
                  <p class="ul2Txt">{{$t('keep_it_in_a_safe_place_on_the_isolated_network_mnemonics')}}</p>
                </div>
              </Col>
            </Row>
          </div>
          <Button type="success" @click="exportMnemonic">{{$t('next')}}
            <Icon type="ios-arrow-round-forward"/>
          </Button>
        </div>
        <div class="stepItem3" v-if="stepIndex == 2">
          <p class="tit">{{$t('please_accurately_copy_the_safety_backup_mnemonic')}}</p>
          <p class="mnemonicWords">{{mnemonic}}</p>
          <Button type="success" @click="exportMnemonic">{{$t('next')}}
            <Icon type="ios-arrow-round-forward"/>
          </Button>
        </div>
        <div class="stepItem4" v-if="stepIndex == 3">
          <p class="tit">
            {{$t('please_click_on_the_mnemonic_in_order_to_confirm_that_you_are_backing_up_correctly')}}</p>
          <div class="sureMnemonicWords" ref="mnemonicWordDiv"></div>
          <p class="mnemonicWords">
            <span v-for="(item, index) in mnemonicRandomArr" @click="sureWord(index)" :key="index">{{item}}</span>
          </p>
          <Button type="success" @click="exportMnemonic">{{$t('next')}}
            <Icon type="ios-arrow-round-forward"/>
          </Button>
        </div>
        <div class="stepItem5" v-if="stepIndex == 4">
          <div class="backupImg">
            <img src="@/common/img/wallet/exportSuccess.png">
          </div>
          <p class="backupTxt">{{$t('the_mnemonic_order_is_correct_and_the_backup_is_successful')}}</p>
          <Button type="success" @click="exportMnemonic">{{$t('complete')}}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import './MnemonicDialog.less'
    import {Crypto} from 'nem2-sdk'
    import {hexCharCodeToStr} from '@/help/help'
    import {walletInterface} from "@/interface/sdkWallet"
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

    @Component({
        components: {},
    })
    export default class mnemonicDialog extends Vue {
        show = false
        stepIndex = 0
        mnemonic = ''
        mnemonicRandomArr = []
        wallet = {
            password: '',
            mnemonicWords: ''
        }
        @Prop()
        showMnemonicDialog: boolean

        get getWallet() {
            return this.$store.state.account.wallet
        }

        mnemonicDialogCancel() {
            this.wallet = {
                password: '',
                mnemonicWords: ''
            }
            this.$emit('closeMnemonicDialog')
            setTimeout(() => {
                this.stepIndex = 0
            }, 300)
        }

        exportMnemonic() {
            switch (this.stepIndex) {
                case 0 :
                    if (!this.checkInput()) return
                    let saveData = {
                        ciphertext: this.getWallet.ciphertext,
                        iv: this.getWallet.iv.data ? this.getWallet.iv.data : this.getWallet.iv,
                        key: this.wallet.password
                    }
                    const DeTxt = Crypto.decrypt(saveData)
                    walletInterface.getWallet({
                        name: this.getWallet.name,
                        networkType: this.getWallet.networkType,
                        privateKey: DeTxt.length === 64 ? DeTxt : ''
                    }).then(async (Wallet: any) => {
                        let mnemonicData = {
                            ciphertext: this.getWallet['mnemonicEnCodeObj'].ciphertext,
                            iv: this.getWallet['mnemonicEnCodeObj'].iv.data ? this.getWallet['mnemonicEnCodeObj'].iv.data : this.getWallet['mnemonicEnCodeObj'].iv,
                            key: this.wallet.password
                        }
                        const DeMnemonic = Crypto.decrypt(mnemonicData)
                        this.mnemonic = hexCharCodeToStr(DeMnemonic)
                        this.mnemonicRandom()
                        this.stepIndex = 1
                        this.wallet.password = ''
                    }).catch(() => {
                        this.$Notice.error({
                            title: this.$t('password_error') + ''
                        })
                    })
                    break;
                case 1 :
                    this.stepIndex = 2
                    break;
                case 2 :
                    this.stepIndex = 3
                    break;
                case 3 :
                    if (!this.checkMnemonic()) return
                    this.stepIndex = 4
                    break;
                case 4 :
                    this.mnemonicDialogCancel()
                    break;
            }
        }

        checkInput() {
            if (!this.wallet.password || this.wallet.password == '') {
                this.$Notice.error({
                    title: this.$t('please_set_your_wallet_password') + ''
                })
                return false
            }
            return true
        }

        checkRandomArr(arr, mnemonic) {
            const randomNum = this.randomNum(mnemonic)
            if (arr.includes(randomNum)) {
                return this.checkRandomArr(arr, mnemonic)
            } else {
                return randomNum
            }
        }

        randomNum(mnemonic) {
            return Math.floor(Math.random() * (mnemonic.length))
        }

        mnemonicRandom() {
            const mnemonic = this.mnemonic.split(' ');
            let numberArr = [];
            let randomWord = [];
            for (let i = 0; i < mnemonic.length; i++) {
                const randomNum = this.checkRandomArr(numberArr, mnemonic)
                numberArr.push(randomNum)
                randomWord.push(mnemonic[randomNum])
            }
            this.mnemonicRandomArr = randomWord
        }

        sureWord(index) {
            const word = this.mnemonicRandomArr[index]
            const wordSpan = document.createElement('span');
            wordSpan.innerText = word;
            wordSpan.onclick = () => {
                this.$refs['mnemonicWordDiv']['removeChild'](wordSpan)
            }
            this.$refs['mnemonicWordDiv']['append'](wordSpan)
        }

        checkMnemonic() {
            const mnemonicDiv = this.$refs['mnemonicWordDiv'];
            const mnemonicDivChild = mnemonicDiv['getElementsByTagName']('span');
            let childWord = []
            for (let i in mnemonicDivChild) {
                if (typeof mnemonicDivChild[i] !== "object") continue;
                childWord.push(mnemonicDivChild[i]['innerText'])
            }
            if (JSON.stringify(childWord) != JSON.stringify(this.mnemonic.split(' '))) {
                if (childWord.length < 1) {
                    this.$Notice.warning({
                        title: this['$t']('Please_enter_a_mnemonic_to_ensure_that_the_mnemonic_is_correct') + ''
                    });
                    return false
                }
                this.$Notice.warning({
                    title: this['$t']('Mnemonic_inconsistency') + ''
                });
                return false
            }
            return true
        }

        @Watch('showMnemonicDialog')
        onShowMnemonicDialogChange() {
            this.show = this.showMnemonicDialog
        }
    }
</script>

<style scoped>

</style>
