import { ExtendedKey, MnemonicPassPhrase, Wallet } from "nem2-hd-wallets";
export var createMnemonic = function () {
    var mnemonic = MnemonicPassPhrase.createRandom('english', 128);
    return mnemonic.plain;
};
export var createAccount = function (mnemonic) {
    var PassPhrase = new MnemonicPassPhrase(mnemonic);
    var bip32Seed = PassPhrase.toSeed();
    var bip32Node = ExtendedKey.createFromSeed(buf2hex(bip32Seed));
    var wallet = new Wallet(bip32Node);
    var account = wallet.getAccount();
    return account;
};
export var randomMnemonicWord = function (mnemonic) {
    var numberArr = [];
    var randomWord = [];
    for (var i = 0; i < mnemonic.length; i++) {
        var randomNum_1 = checkRandomArr(numberArr, mnemonic);
        numberArr.push(randomNum_1);
        randomWord.push(mnemonic[randomNum_1]);
    }
    return randomWord;
};
function checkRandomArr(arr, mnemonic) {
    var mnemonicNum = randomNum(mnemonic);
    if (arr.includes(mnemonicNum)) {
        return checkRandomArr(arr, mnemonic);
    }
    else {
        return mnemonicNum;
    }
}
function randomNum(mnemonic) {
    return Math.floor(Math.random() * (mnemonic.length));
}
function buf2hex(buffer) {
    // buffer is an ArrayBuffer
    // create a byte array (Uint8Array) that we can use to read the array buffer
    var byteArray = new Uint8Array(buffer);
    // for each element, we want to get its two-digit hexadecimal representation
    var hexParts = [];
    for (var i = 0; i < byteArray.length; i++) {
        // convert value to hexadecimal
        var hex = byteArray[i].toString(16);
        // pad with zeros to length 2
        var paddedHex = ('00' + hex).slice(-2);
        // push to array
        hexParts.push(paddedHex);
    }
    // join all the hex values of the elements into a single string
    return hexParts.join('');
}
//# sourceMappingURL=mnemonicUtil.js.map