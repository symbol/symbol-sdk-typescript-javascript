<template>
  <div class="normal_set">
    <ul>
      <li>
        切换语言
        <div class="gray_content">
          <Select v-model="language">
            <Option v-for="item in languageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

      </li>
      <li>
        货币设置
        <div class="gray_content">
          <Select v-model="coin">
            <Option v-for="item in coinList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

      </li>
      <li>
        账户名
        <div class="tips">默认为Number</div>
        <div class="gray_content">
          <input class="absolute" type="text" placeholder="请再次输入新的密码">
        </div>
        <span class="confirm_button">确认</span>

      </li>
    </ul>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class SettingNormal extends Vue {
        language = ''
        coin = ''
        languageList = [
            {
                value: 'zh-CN',
                label: '中文'
            },
            {
                value: 'en-US',
                label: 'English'
            }
        ]
        coinList = [
            {
                value: 'XEM',
                label: 'XEM'
            },
            {
                value: 'ETC',
                label: 'ETC'
            }
        ]

    }
</script>
<style scoped lang="less">
  @import "SettingNormal.less";
</style>
