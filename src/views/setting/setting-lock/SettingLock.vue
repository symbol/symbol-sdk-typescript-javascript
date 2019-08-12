<template>
  <div class="lock_content">
    <ul>
      <li>
        {{$t('old_password')}}
        <div class="gray_content">
          <input class="absolute" type="password" v-model="prePassword" @input="changeBtnState"
                 :placeholder="$t('please_enter_the_original_password')">
        </div>
      </li>
      <li>
        {{$t('set_password')}}
        <div class="tips">
          {{$t('this_password_is_used_to_lock_the_desktop_wallet_Once_lost_you_will_lose_the_right_to_enter_the_desktop_wallet')}}
        </div>
        <div class="gray_content">
          <input class="absolute" type="password" v-model="newPassword"
                 :placeholder="$t('please_enter_a_new_password')">
        </div>
      </li>
      <li>
        {{$t('confirm_password')}}
        <div class="gray_content">
          <input class="absolute" type="password" v-model="repeatPassword"
                 :placeholder="$t('please_enter_your_new_password_again')">
        </div>
        <span :class="[btnState?'sure_button':'confirm_button']" @click="confirmUpdate">{{$t('confirm')}}</span>

      </li>

    </ul>


  </div>
</template>

<script lang="ts">
    import {UInt64} from 'nem2-sdk'
    import {Message} from "@/config/index"
    import {localRead, localSave} from '@/help/help'
    import {Component, Vue} from 'vue-property-decorator'
    import {decryptKey, encryptKey} from "@/help/appUtil"

    @Component
    export default class SettingLock extends Vue {
        prePassword = ''
        newPassword = ''
        repeatPassword = ''
        lockKey = [50, 50]
        btnState = false

        get getWallet() {
            return this.$store.state.account.wallet
        }

        changeBtnState() {
            if (this.prePassword == '') {
                this.btnState = false
            } else {
                this.btnState = true
            }
        }

        checkInfo() {
            const {prePassword, newPassword, repeatPassword} = this

            if (prePassword == '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (newPassword == '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (repeatPassword == '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (newPassword !== repeatPassword) {
                this.$Notice.error({
                    title: '' + this.$t(Message.INCONSISTENT_PASSWORD_ERROR)
                })
                return false
            }
            return true
        }

        confirmUpdate() {
            if (!this.btnState || !this.checkInfo()) {
                return
            }
            this.decryptKey()
        }

        updatePW() {
            let encryptObj = encryptKey(new UInt64(this.lockKey).toHex(), this.newPassword)
            let saveData = {
                ciphertext: encryptObj.ciphertext,
                iv: encryptObj.iv,
            }
            localSave('lock', JSON.stringify(saveData))
            this.init()
            this.$Notice.success({
                title: this.$t(Message.SUCCESS) + ''
            })
        }

        decryptKey() {
            let lock: any = localRead('lock')
            try {
                const u = [50, 50]
                lock = JSON.parse(lock)
                const enTxt = decryptKey(lock, this.prePassword)
                if (enTxt !== new UInt64(u).toHex()) {
                    this.$Notice.error({title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''});
                } else {
                    this.updatePW()
                }
            } catch (e) {
                this.$Notice.error({title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''});
            }
        }

        init() {
            this.prePassword = ''
            this.newPassword = ''
            this.repeatPassword = ''
        }

        created() {
            this.init()
        }
    }
</script>
<style scoped lang="less">
  @import "SettingLock.less";
</style>
