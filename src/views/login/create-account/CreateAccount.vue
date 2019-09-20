<template>
  <div class="create_wallet radius">
    <div class="createDiv">
      <div class="createForm">
        <p class="formTit">{{$t('Create_an_account_and_password')}}</p>
        <p class="title_describe">{{$t('The_wallet_terminal_will_use_the_HD_WALLET_protocol_to_provide')}}</p>
        <Form :model="formItem" label-position="top">

          <ul>
            <li>
              <FormItem :label="$t('set_the_account_name')">
                <Input v-model="formItem.accountName" :placeholder="$t('Please_enter_the_name_of_the_wallet')"/>
              </FormItem>
            </li>
            <li>

              <FormItem :label="$t('set_password_8_char')">
                <Input v-model="formItem.password" type="password" required
                       :placeholder="$t('please_set_your_wallet_password')"/>
              </FormItem>
            </li>
            <li>
              <FormItem :label="$t('confirm_password')">
                <Input v-model="formItem.passwordAgain" type="password" required
                       :placeholder="$t('please_enter_your_password_again')"/>
              </FormItem>
            </li>

            <li>
              <FormItem :label="$t('hint')">
                <Input v-model="formItem.hint" required
                       :placeholder="$t('hint')"/>
              </FormItem>
            </li>
          </ul>
          <FormItem>
            <div class="clear">
              <Button class="prev" type="default" @click="toBack">{{$t('back_to_home_page')}}</Button>
              <Button class="right" type="success" @click="createAccount">{{$t('next')}}</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    //@ts-ignore
    import {CreateAccountTs} from '@/views/login/create-account/CreateAccountTs'
    import "./CreateAccount.less"

    export default class CreateAccount extends CreateAccountTs {

    }
</script>

<style scoped lang="less">
</style>
