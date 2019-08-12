<template>
  <div class="relogin_container radius scroll">
    <video muted="muted" src="@/common/img/login/cloudsVideo.mp4" loop="loop" autoplay="true"></video>
    <div class="text_container">
      <div class="top">
        <img src="@/common/img/login/loginNewLogo.png" alt="">
      </div>

      <div class="middle_text">
        WELCOME TO CATAPULT-NANO-WALLET
      </div>

      <div class="bottom_text">
        This is a distributed desktop wallet based on catapult. come and explore the wonderful journey of catapult.
      </div>

      <div class="bottom_input">
        <input type="password" placeholder="Lock Password"  v-model="form.password" >
        <img @click="jumpToDashBoard" src="@/common/img/login/loginJump.png" alt="">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Message} from "config/index"
    import {Crypto, UInt64} from 'nem2-sdk'
    import {localRead} from '@/help/help.ts'
    import {Component, Vue} from 'vue-property-decorator'

    @Component
    export default class MonitorRelogin extends Vue {
        form = {
            password:''
        }
        currentText:any = ''

        created() {
            this.$store.state.app.unClick = true
        }

        checkLock() {
            let lock:any = localRead('lock')
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
                    name: 'walletPanel',
                    params: {
                        create: 'true'
                    }
                })
                return
            }
            this.$store.state.app.isInLoginPage = false
            this.$router.push({
                name: 'dashBoard'
            })

        }
    }
</script>
<style scoped lang="less">
  @import "NewRelogin.less";
</style>
