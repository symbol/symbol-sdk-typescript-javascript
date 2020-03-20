<template>
    <div v-click-focus class="show-mnemonic">
        <div class="input-already" v-for="(word,index) in wordsArray" :key="index">{{word}}</div>
        <div class="mnemonic-input-container">
            <input class="mnemonic-input" v-on:paste.prevent='handlePaste($event)' v-on:keyup.space='addWord'
                v-on:keyup.delete="deleteWord" v-model="userInput" type="text" maxlength="50">
        </div>
        <div class="copy-button" v-on:click="copyToClipboard"><Button  type="text" >{{$t('mnemonic_copy')}}</Button></div> 
    </div>
</template>
<script lang="ts">
import { MnemonicInputTs } from "./MnemonicInputTs";
export default class MnemonicInput extends MnemonicInputTs { };
</script>
<style lang="less" scoped>
@import "./MnemonicInput.less";
</style>