<template>
  <div class="createLockWrap">
    <h1 class="pageTit">{{$t('create_a_Lock_password')}}</h1>
    <p class="pageRemind">{{$t('lock_pass_text')}}</p>
    <p class="pageRemind">{{$t('lock_pass_text_2')}}</p>
    <div class="formDiv">
      <ul>
        <li>
          {{$t('new_password')}}
          <div class="gray_content">
            <input class="absolute" type="text" :placeholder="$t('please_enter_the_original_password')">
          </div>
        </li>
        <li>
          {{$t('confirm_password')}}
          <div class="gray_content">
            <input class="absolute" type="text" :placeholder="$t('please_enter_a_new_password')">
          </div>
        </li>
        <li>
          {{$t('set_password_hint')}}

          <div class="tips">
            {{$t('password_hints_great_help_when_you_forget_your_password')}}
          </div>
          <div class="gray_content">
            <input class="absolute" type="text" :placeholder="$t('please_set_a_password_prompt')">
          </div>
        </li>
      </ul>
    </div>
    <div class="buttonDiv clear">
      <Button @click="jumpToOtherPage('welcomePage')" class="prev left">{{$t('return_to_the_welcome_page')}}</Button>
      <Button @click="jumpToOtherPage('guideInto')" class="next right">{{$t('next')}}</Button>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class createLockPW extends Vue {
        lockPW: any = {
            password: '',
            checkPW: '',
            remindTxt: ''
        }

        jumpToOtherPage(name) {
            this.$router.push({
                name
            })
        }
    }
</script>

<style scoped lang="less">
  @import "createLockPW.less";
</style>

