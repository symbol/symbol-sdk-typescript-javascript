<template>
  <div class="createLockWrap scroll">
    <h1 class="pageTit">{{$t('create_a_Lock_password')}}</h1>
    <p class="pageRemind">{{$t('lock_pass_text')}}</p>
    <p class="pageRemind">{{$t('lock_pass_text_2')}}</p>
    <div class="formDiv">
      <ul>
        <li>
          {{$t('new_password')}}
          <div class="gray_content">
            <input class="absolute" v-model="lockPW.password" type="password"  :placeholder="$t('please_enter_the_original_password')">
          </div>
        </li>
        <li>
          {{$t('confirm_password')}}
          <div class="gray_content">
            <input class="absolute" type="password"  v-model="lockPW.checkPW" :placeholder="$t('please_enter_a_new_password')">
          </div>
        </li>
        <li>
          {{$t('set_password_hint')}}

          <div class="tips">
            {{$t('password_hints_great_help_when_you_forget_your_password')}}
          </div>
          <div class="gray_content">
            <input class="absolute" type="text" v-model="lockPW.remindTxt" :placeholder="$t('please_set_a_password_prompt')">
          </div>
        </li>
      </ul>
    </div>
    <div class="buttonDiv clear">
      <Button @click="jumpToOtherPage('/login')" class="prev left">{{$t('return_to_the_welcome_page')}}</Button>
      <Button @click="jumpToOtherPage('/walletPanel')" class="next right">{{$t('next')}}</Button>
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

        checkInput () {
            if(!this.lockPW.password || this.lockPW.password === ''){
                this.$Message.error(Message.PASSWORD_CREATE_ERROR);
                return false
            }
            if(this.lockPW.password !== this.lockPW.checkPW){
                this.$Message.error(Message.INCONSISTENT_PASSWORD_ERROR);
                return false
            }
            if(!this.lockPW.remindTxt || this.lockPW.remindTxt === ''){
                this.$Message.error(Message.PASSWORD_HIT_SETTING_ERROR);
                return false
            }
            return true
        }

        jumpToOtherPage(path) {
            if(path === '/walletPanel'){
                const u = [50,50]
                if(!this.checkInput()) return
                const encryptObj = Crypto.encrypt(new UInt64(u).toHex(), this.lockPW.password)
                let saveData = {
                    ciphertext: encryptObj.ciphertext,
                    iv: encryptObj.iv,
                }
                localSave('lock', JSON.stringify(saveData))
            }
            this.$router.push({
                path: path
            })
        }
    }
</script>

<style scoped lang="less">
  @import "./CreateLockPassword.less";
</style>

