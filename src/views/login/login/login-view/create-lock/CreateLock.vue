<template>
  <div class="createLockWrap scroll">
    <img class="close pointer" @click="hideIndexView" src="@/common/img/login/loginClose.png" alt="">
    <div class="pageTit">{{$t('CREATE_LOCK_PASSWORD')}}</div>
    <div class="pageRemind">{{$t('This_password_is_used_for_desktop_wallet_locking')}}</div>

    <div class="formDiv">
      <ul>
        <li>
          <div class="gray_content">
            <input v-model="lockPW.password" type="password"
                   :placeholder="$t('Set_the_password')">
            <img src="@/common/img/login/loginLock.png" alt="">
          </div>
        </li>
        <li>

          <div class="gray_content">
            <input type="password" v-model="lockPW.checkPW"
                   :placeholder="$t('Confirm_the_password')">
          </div>
        </li>
        <li>
          <div class="gray_content">
            <input type="text" v-model="lockPW.remindTxt"
                   :placeholder="$t('Set_the_password_prompts')">
            <img src="@/common/img/login/loginBell.png" alt="">
          </div>
        </li>
      </ul>
    </div>
    <div class="buttonDiv clear">
      <button @click="showIndexView" class="pointer">CREATE</button>
    </div>
  </div>
</template>

<script lang="ts">
    import {Message} from "@/config/index"
    import {Crypto, UInt64} from 'nem2-sdk'
    import {localSave} from '@/help/help.ts'
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class createLockPW extends Vue {
        lockPW = {
            password: '',
            checkPW: '',
            remindTxt: ''
        }

        checkInput() {

            if (!this.lockPW.password || this.lockPW.password === '') {
                this.$Notice.error({
                    title: this.$t(Message.PASSWORD_CREATE_ERROR) + ''
                });
                return false
            }
            if (this.lockPW.password !== this.lockPW.checkPW) {
                this.$Notice.error({
                    title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + '',
                });
                return false
            }
            if (!this.lockPW.remindTxt || this.lockPW.remindTxt === '') {
                this.$Notice.error({
                    title: this.$t(Message.PASSWORD_HIT_SETTING_ERROR) + '',
                });
                return false
            }
            return true
        }

        showIndexView() {

            const u = [50, 50]
            if (!this.checkInput()) return
            const encryptObj = Crypto.encrypt(new UInt64(u).toHex(), this.lockPW.password)
            let saveData = {
                ciphertext: encryptObj.ciphertext,
                iv: encryptObj.iv,
                remindTxt: this.lockPW.remindTxt
            }
            localSave('lock', JSON.stringify(saveData))
            this.$emit('showIndexView', 2)
        }

        hideIndexView() {
            this.$emit('showIndexView', 0)
        }

        // jumpToOtherPage(path) {
        //     if (path === '/walletPanel') {
        //         const u = [50, 50]
        //         if (!this.checkInput()) return
        //         const encryptObj = Crypto.encrypt(new UInt64(u).toHex(), this.lockPW.password)
        //         let saveData = {
        //             ciphertext: encryptObj.ciphertext,
        //             iv: encryptObj.iv,
        //         }
        //         localSave('lock', JSON.stringify(saveData))
        //     }
        //     this.$router.push({
        //         path: path
        //     })
        // }
    }
</script>

<style scoped lang="less">
  @import "CreateLock.less";
</style>

