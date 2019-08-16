<template>
    <div class="relogin_container radius scroll">
      <video muted="muted" src="@/common/img/login/cloudsVideo.mp4" loop="loop" autoplay="true"></video>

      <div class="switch_language">
        <i-select @on-change="switchLanguage" :model="currentLanguage"
                  :placeholder="currentLanguage ? $store.state.app.localMap[currentLanguage] : '中文'">
          <i-option v-for="(item, index) in languageList" :value="item.value" :key="index">{{ item.label }}</i-option>
        </i-select>
      </div>

      <div class="fix_contnet">
        <GetStart @showIndexView="showIndexView" v-if="indexShowList[0]"></GetStart>
        <CreateLock @showIndexView="showIndexView" v-if="indexShowList[1]"></CreateLock>
        <InputLock @showIndexView="showIndexView" v-if="indexShowList[2]"></InputLock>
      </div>
    </div>
</template>

<script lang="ts">
    import {LoginTs} from './LoginTs'

    export default class Login extends LoginTs {

    }
</script>
<style scoped lang="less">
  @import "Login.less";
</style>
