<template>
  <div class="mnemonic_container"  @keyup.enter="verificationSuccess">
    <div class="mnemonicWordDiv clear scroll">
        <draggable v-model="confirmedMnemonicList" @end="drag=false" ghost-class="ghost">
          <transition-group>
            <span v-for="(c,index) in confirmedMnemonicList" :key="c" >
              <Tag closable @on-close="removeConfirmedWord(index)">{{c}}</Tag>
            </span>
          </transition-group>
        </draggable>
    </div>
    <div class="wordDiv clear">
          <span v-for="(item,index) in mnemonicRandomList"
                :class="confirmedIndexList[index]?'confirmed_word':''"
                :key="index"
                @click="sureWord(index)">
            {{item}}
          </span>
    </div>
    <div class="buttons clear">
      <Button class="prev left" type="default" @click="toPreviousPage">{{$t('previous')}}</Button>
      <Button class="next right" v-focus type="success" @click="verificationSuccess">{{$t('next')}}</Button>
    </div>
  </div>
</template>

<script lang="ts">
    import {MnemonicVerificationTs} from '@/components/mnemonic-verification/MnemonicVerificationTs.ts'
    import './MnemonicVerification.less'

    export default class MnemonicVerification extends MnemonicVerificationTs {


    }
</script>
<style scoped lang="less">

</style>
