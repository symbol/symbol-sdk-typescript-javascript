<template>
  <div class="text_container" @keyup.enter="jumpToDashBoard()">
    <Modal
            v-model="isShowClearCache"
            title=""
            class="clear_cache_panel"
            :transfer="true">

      <div class="title">{{$t('clear_cache')}}</div>
      <img src="@/common/img/login/loginWarningIcon.png" alt="">
      <div class="tip">
        {{$t('We_will_clear_your_cache_reset_account_password_please_make_sure_your_wallet_is_safely_backed_up')}}
      </div>
      <div class="confirm">{{$t('confirm')}}</div>
    </Modal>


    <div class="top">
      <img src="@/common/img/login/loginNewLogo.png" alt="">
    </div>

    <div class="middle_text">
      {{$t('WELCOME_TO_CATAPULT_NANO_WALLET')}}
    </div>

    <div class="bottom_text">
      {{$t('This_is_a_distributed_desktop_wallet_based_on_catapult_come_and_explore_the_wonderful_journey_of_catapult')}}
    </div>

    <div class="bottom_input">
      <input type="password" :placeholder="$t('lock_password')" v-model="form.password">
      <img @click="jumpToDashBoard" src="@/common/img/login/loginJump.png" alt="">
    </div>

    <div class="password_prompt_text">
      <span v-if="isShowPrompt"> {{$t('passowrd_prompt')}}：{{lockPromptText}}</span>
    </div>

    <div class="password_prompt">
      {{$t('forget_password')}}？<span @click="showPrompt"
                                      class="pointer click_to_show_prompt">{{$t('passowrd_prompt')}}</span>
      <span class="clear_cache pointer"
            v-show="isShowPrompt">{{$t('clear_cache')}}</span>
    </div>

  </div>
</template>

<script lang="ts">
    import "./InputLock.less"
    import {Message} from "@/config/index"
    import {Crypto, UInt64} from 'nem2-sdk'
    import {localRead} from '@/help/help.ts'
    import {InputLockConstructor} from './InputLockConstructor'
    import {Component, Vue} from 'vue-property-decorator'

    @Component
    export default class InputLock extends InputLockConstructor {
        // lockPromptText = ''
        // isShowPrompt = false
        // currentText: any = ''
        // isShowClearCache = false
        // form = {
        //     password: ''
        // }

        showPrompt() {
            this.isShowPrompt = true
        }

        showIndexView() {
            this.$emit('showIndexView', 1)
        }

        checkInput() {
            const {form} = this
            if (form.password == '') {
                this.$Notice.error({title: this.$t(Message.INPUT_EMPTY_ERROR) + ''});
                return false
            }
            return true
        }

        checkLock() {
            if (!this.checkInput()) {
                return
            }

            let lock: any = localRead('lock')
            try {
                const u = [50, 50]
                lock = JSON.parse(lock)
                let saveData = {
                    ciphertext: lock.ciphertext,
                    iv: lock.iv.data,
                    key: this.form.password
                }
                const enTxt = Crypto.decrypt(saveData)
                if (enTxt !== new UInt64(u).toHex()) {
                    this.$Notice.error({title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''});
                    return false
                }
                return true
            } catch (e) {
                this.$Notice.error({title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''});
                return false
            }
        }


        jumpToDashBoard() {
            if (!this.checkLock()) return
            if (this.$store.state.app.walletList.length == 0) {
                this.$router.push({
                    name: 'walletCreate',
                    params: {
                        name: 'walletCreate'
                    }
                })
                return
            }
            this.$store.state.app.isInLoginPage = false
            this.$router.push({
                name: 'dashBoard'
            })

        }

        clearCache() {
            // localRead remove
            // localRemove('lock')
            // localRemove('wallets')
            // localRemove('loglevel:webpack-dev-server')
        }

        created() {
            // TODO SPLIT DATA
            console.log(this)
            this.$store.state.app.isInLoginPage = true
            this.lockPromptText = JSON.parse(localRead('lock')).remindTxt

        }
    }
</script>
<style scoped lang="less">

</style>
