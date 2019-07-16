<template>
  <div class="setting_container radius">
    <Modal
            title="修改账户密码"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">

      <div class="amount flex_center">
        <span class="title">原始密码</span>
        <span class="value radius flex_center">
              <input type="text" placeholder="请输入原始密码" v-model="assetAmount">
        </span>
      </div>
      <div class="amount flex_center">
        <span class="title">新密码</span>
        <span class="value radius flex_center">
              <input type="text" placeholder="请输入新的密码" v-model="assetAmount">
        </span>
      </div>
      <div class="amount flex_center">
        <span class="title">确认密码</span>
        <span class="value radius flex_center">
              <input type="text" placeholder="请再次输入密码" v-model="assetAmount">
        </span>
      </div>

      <div @click="updateConfirme()" class="send_button">
        确认
      </div>
    </Modal>


    <div class="top_normal_setting setting_content">
      <div class="title">常规设置</div>
      <div class="item_container">
        <div class="item_title">切换网络</div>
        <div class="sub_title">当前网络：Testnet</div>
        <div class="selector radius">
          <Select v-model="currentList">
            <Option v-for="item in nodeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>

      <div class="item_container">
        <div class="item_title">切换货币</div>
        <div class="sub_title">当前币种：CNY,切换货币可以完成对整个钱包货币的切换</div>
        <div class="selector radius">
          <Select v-model="currentList">
            <Option v-for="item in nodeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
    </div>


    <div class="bottom_normal_setting setting_content">
      <div class="title">账户设置</div>
      <div class="item_container">
        <div class="item_title">修改账户名</div>
        <div class="sub_title">当前账户名：Testnet</div>
        <div class="selector radius">
          <Input v-model="value" placeholder="请输入新的账户名"/>
        </div>
      </div>
      <div class="item_container">
        <div class="item_title" @click="updatePassword">
          <span class="left">修改密码</span>
          <img class="right" src="../../assets/images/setting/settingUpdatePassword.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Setting extends Vue {
        nodeList = [
            {
                value: 'TEST',
                label: 'TEST'
            }, {
                value: 'MAIN',
                label: 'MAIN'
            }, {
                value: 'MIJIN',
                label: 'MIJIN'
            }, {
                value: 'MIJIN_TEST',
                label: 'MIJIN_TEST'
            }
        ]
        currentList = ''
        isShowDialog = false

        updatePassword() {
            this.isShowDialog = true
        }

        updateConfirme() {
            this.isShowDialog = false
        }
    }
</script>
<style scoped lang="less">
  @import "Setting.less";
</style>
