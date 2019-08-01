<template>
  <div class="text_container">
    <div class="top">
      <img src="../../../../../assets/images/login/loginNewLogo.png" alt="">
    </div>

    <div class="middle_text">
      {{$t('WELCOME_TO_CATAPULT_NANO_WALLET')}}
    </div>

    <div class="bottom_text">
      {{$t('This_is_a_distributed_desktop_wallet_based_on_catapult_come_and_explore_the_wonderful_journey_of_catapult')}}
    </div>

    <div class="bottom_input">
      <input type="password" :placeholder="$t('lock_password')" v-model="form.password">
      <img @click="jumpToDashBoard" src="../../../../../assets/images/login/loginJump.png" alt="">
    </div>

    <div class="password_prompt_text">
      <span v-if="isShowPrompt"> {{$t('passowrd_prompt')}}：{{lockPromptText}}</span>
    </div>

    <div class="password_prompt">
      {{$t('forget_password')}}？<span @click="showPrompt" class="pointer click_to_show_prompt">{{$t('passowrd_prompt')}}</span>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {Crypto, UInt64} from 'nem2-sdk'
    import {localRead} from '@/utils/util'
    import Message from "@/message/Message";

    @Component
    export default class MonitorRelogin extends Vue {

        lockPromptText = ''


        form = {
            password: ''
        }
        currentText: any = ''
        isShowPrompt = false

        showPrompt() {
            this.isShowPrompt = true
        }

        showIndexView() {
            this.$emit('showIndexView', 1)
        }

        checkLock() {
            let lock = localRead('lock')
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
                    this.$Message.error(Message.WRONG_PASSWORD_ERROR);
                    return false
                }
                return true
            } catch (e) {
                this.$Message.error(Message.WRONG_PASSWORD_ERROR);
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

        created() {
            this.$store.state.app.isInLoginPage = true
            this.lockPromptText = JSON.parse(localRead('lock')).remindTxt
        }
    }
</script>
<style scoped lang="less">
  @import "InputLock.less";
</style>
