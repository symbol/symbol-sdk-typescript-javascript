<template>
  <div class="relogin_container radius scroll">
    <div class="top_slogan">
      <img src="../../../assets/images/relogin/reloginNemLogo.png" alt="">
      <span>
        <div class="top">欢迎回到CATAPULT测试版</div>
        <div class="bottom">这是一个基于CATAPULT的分布式桌面钱包 祝你旅途愉快</div>
      </span>
    </div>

    <div class="middle_icon">
      <div class="icon_content">
        <div class="icon_item" v-for="i in iconList" @mouseover="changeText(i.text)">
          <img :src="i.icon" alt="">
        </div>
      </div>

      <div class="icon_text">
        {{currentText}}
      </div>

    </div>

    <div class="bottom_login">
      <div class="bottom_content">
        <div class="top_password">
          <input type="text" placeholder="Lock Password">
          <img src="../../../assets/images/relogin/reloginDoubt.png" alt="">
        </div>
        <div @click="jumpToDashBoard" class="bottom_button pointer"> LOG IN</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import reloginAddress from '../../../assets/images/relogin/reloginAddress.png'
    import reloginApostille from '../../../assets/images/relogin/reloginApostille.png'
    import reloginAsset from '../../../assets/images/relogin/reloginAsset.png'
    import reloginFile from '../../../assets/images/relogin/reloginFile.png'
    import reloginLink from '../../../assets/images/relogin/reloginLink.png'
    import reloginNamespace from '../../../assets/images/relogin/reloginNamespace.png'
    import reloginSend from '../../../assets/images/relogin/reloginSend.png'
    import reloginWidgets from '../../../assets/images/relogin/reloginWidgets.png'


    @Component
    export default class MonitorRelogin extends Vue {
        iconList = [
            {
                icon: reloginSend,
                text: '只需1分钟的时间，几乎立即发送和接收XEM !'
            }, {
                icon: reloginFile,
                text: '多重签名账户中提供可编辑的链上协议，是存储资金，实现共有账户的最佳实现方式'
            }, {
                icon: reloginNamespace,
                text: '命名空间是存储马赛克的域名，每个命名空间在区块链中唯一，可在多层子命名空间上定义和认证马赛克。'
            }, {
                icon: reloginAsset,
                text: 'NEM马赛克是具备丰富属性和功能的智能资产。如需创建马赛克，必须为账户置备根命名空间。'
            }, {
                icon: reloginLink,
                text: '委托收获是可以实现远程在线“挖矿”而不必保持原账号开启的途径'
            }, {
                icon: reloginApostille,
                text: '使用NEM Apostille服务创建区块链公证时间戳,跟踪和审计文件认证状态。'
            }, {
                icon: reloginAddress,
                text: '将标签分配给地址以轻松跟踪联系人.'
            }, {
                icon: reloginWidgets,
                text: 'Use Changelly and ShapeShift widgets to buy XEM at the best rates!'
            }
        ]
        currentText = ''


        changeText(text) {
            this.currentText = text
        }

        created() {
            this.$store.state.app.unClick = true
            this.currentText = this.iconList[0].text
        }
        jumpToDashBoard(){
            this.$store.state.app.unClick = false
            this.$router.push({
                name:'dashBoard'
            })
        }
    }
</script>
<style scoped lang="less">
  @import "MonitorRelogin.less";
</style>
