<template>
  <div class="normal_set">
    <ul>
      <li>
        {{$t('switch_language')}}
        <div class="gray_content">
          <Select v-model="language" @on-change="switchLanguage" :placeholder="$t('switch_language')">
            <Option v-for="item in languageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

      </li>
      <li>
        {{$t('currency_setting')}}
        <div class="gray_content">
          <Select v-model="coin" :placeholder="$t('currency_setting')">
            <Option v-for="item in coinList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </li>

      <li>
        {{$t('Time_zone_setting')}}
        <div class="gray_content">

          <Select v-model="tz" :placeholder="$t('Time_zone_setting')" >
            <Option v-for="item in timeZoneListData" :value="item.value" :key="item.value">
              <span @click="chooseTimeZone(item)">{{ item.label }}</span>
            </Option>
          </Select>

          <!--          -->
          <!--          <Select v-model="tz" :placeholder="$t('Time_zone_setting')">-->
          <!--            <Option @click="chooseTimeZone(item)" v-for="item in timeZoneListData" :value="item.value"-->
          <!--                    :key="item.value">-->
          <!--              <span>{{ item.label }}</span></Option>-->
          <!--          </Select>-->
        </div>
      </li>

      <li>
        {{$t('account_name')}}
        <div class="tips">{{$t('the_default_is_Number')}}</div>
        <div class="gray_content input">
          <input class="absolute" type="text" :placeholder="$t('please_input_new_account_name')">
        </div>
        <span class="confirm_button un_click">{{$t('confirm')}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
    //@ts-ignore
    import {SettingNormalTs} from '@/views/setting/setting-normal/SettingNormalTs.ts'

    export default class SettingNormal extends SettingNormalTs {

    }
</script>
<style scoped lang="less">
  @import "SettingNormal.less";
</style>
