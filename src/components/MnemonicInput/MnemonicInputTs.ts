import { UIHelpers } from '@/core/utils/UIHelpers.ts';
import { Component, Vue } from 'vue-property-decorator';
// internal dependencies

@Component
export class MnemonicInputTs extends Vue {
  /**
   * @description: wordsArray
   */
  public wordsArray = [];

  /**
   * @description: status of isEditing 
   */
  public isEditing: boolean = false;

  /**
   * @description: isNeedPressDelTwice
   */
  public isNeedPressDelTwice = true;

  /**
   * @description: watch the inputform
   */
  public inputWord: string = "";
  
  public get userInput(): string {
    return this.inputWord;
  }
  public set userInput(input:string) {
    //avoid cache
    this.inputWord=input;
    //add the limit
    if (this.wordsArray.length >= 24) {
      this.inputWord = '';
      this.initInput();
    } else {
      //control the keyboard input rules
      this.inputWord = input.replace(/[^a-zA-Z]/g, '')
      //determine if the input is editing status
      if (!this.isEditing && !!this.inputWord) {
        this.isEditing = true
      }
    }
  }

  /**
   * @description: add word to the wordsArray
   */
  addWord() {
    if (this.inputWord.length >= 2 && this.inputWord.length <= 50) {
      if (this.wordsArray.length < 24) {
        this.handleWordsArray(this.inputWord);
        this.inputWord = '';
        this.initInput();
      }

    }
  }

  /**
   * @description: delete the word
   */
  deleteWord() {
    if (this.inputWord) {
      this.isNeedPressDelTwice = true;
    } else {
      if (this.isEditing) {
        if (this.isNeedPressDelTwice) {
          this.isNeedPressDelTwice = false;
          return
        }
        this.handleWordsArray();
        this.initInput()
      } else {
        this.handleWordsArray()
        this.initInput()
      }
    }
  }

  /**
   * @description: add one word  or reduce one word
   */
  handleWordsArray(item?) {
    if (!!item) {
      this.wordsArray.push(item)
    } else {
      this.wordsArray.pop()
    }
    //transform to lower case
    this.wordsArray.forEach((item: string, index) => {
      this.wordsArray[index] = item.toLowerCase();
    })
    this.$emit('handle-words', this.wordsArray)
  }
  handlePaste(e: ClipboardEvent) {
    let pasteDataArr: Array<string> = e.clipboardData.getData('text').toString().trim().split(/\s+/g)
    pasteDataArr.forEach((pasteData) => {
      if (!!pasteData && this.wordsArray.length < 24) {
        this.handleWordsArray(pasteData);
      }
    })
  }
  copyToClipboard() {
    let pasteDataStr: string = this.wordsArray.join(' ');
    if(pasteDataStr){
      UIHelpers.copyToClipboard(pasteDataStr);
    }
  }
  /**
   * @description: init input
   */
  initInput() {
    this.isNeedPressDelTwice = true;
    this.isEditing = false;
  }

}