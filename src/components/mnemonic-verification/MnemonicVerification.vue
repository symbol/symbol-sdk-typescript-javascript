<template>
  <div class="mnemonic_container"  @keyup.enter="checkMnemonic()">
    <div class="mnemonicWordDiv clear scroll">
        <draggable v-model="confirmedIndexList" @end="drag=false" ghost-class="ghost">
          <span v-for="(confirmedIndex, index) in confirmedIndexList" :key="index">
            <Tag closable @on-close="removeConfirmedWord(confirmedIndex)">
              {{mnemonicRandomList[confirmedIndex]}}
            </Tag>
          </span>
        </draggable>
    </div>
    <div class="wordDiv clear">
          <span v-for="(item,index) in mnemonicRandomList"
                :class="confirmedIndexList.includes(index)?'confirmed_word':''"
                :key="index"
                @click="wordClicked(index)">
            {{item}}
          </span>
    </div>
    <div class="buttons clear">
      <Button class="prev left" type="default" @click="$emit('toPreviousPage')">
        {{$t('previous')}}
      </Button>
      <Button class="next right" v-focus type="success" @click="checkMnemonic()">
        {{$t('next')}}
      </Button>
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
