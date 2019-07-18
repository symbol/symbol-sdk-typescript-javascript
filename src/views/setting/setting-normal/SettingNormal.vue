<template>
  <div class="normal_set">
    <ul>
      <li>
        {{$t('switch_language')}}
        <div class="gray_content">
          <Select v-model="language">
            <Option v-for="item in languageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

      </li>
      <li>
        {{$t('currency_setting')}}
        <div class="gray_content">
          <Select v-model="coin">
            <Option v-for="item in coinList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

      </li>
      <li>
        {{$t('account_name')}}
        <div class="tips">{{$t('the_default_is_Number')}}</div>
        <div class="gray_content">
          <input class="absolute" type="text" :placeholder="$t('please_enter_your_new_password_again')">
        </div>
        <span class="confirm_button">{{$t('confirm')}}</span>

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
        languageList = []
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

        created() {
            this.languageList = this.$store.state.app.languageList
        }

    }
</script>
<style scoped lang="less">
  @import "SettingNormal.less";
</style>
