import {ExtendedKey, MnemonicPassPhrase, Wallet} from "nem2-hd-wallets";

export const createMnemonic = () => {
    const mnemonic = MnemonicPassPhrase.createRandom('english', 128);
    return mnemonic.plain
}

export const createAccount = (mnemonic) => {
    const PassPhrase = new MnemonicPassPhrase(mnemonic);
    const bip32Seed = PassPhrase.toSeed();
    const bip32Node = ExtendedKey.createFromSeed(buf2hex(bip32Seed));
    const wallet = new Wallet(bip32Node);
    const account = wallet.getAccount();
    return account
}

export const randomMnemonicWord = (mnemonic) => {
    let numberArr = [];
    let randomWord = [];
    for (let i = 0; i < mnemonic.length; i++) {
        const randomNum = checkRandomArr(numberArr, mnemonic)
        numberArr.push(randomNum)
        randomWord.push(mnemonic[randomNum])
    }
    return randomWord
}

function checkRandomArr(arr, mnemonic) {
    const mnemonicNum = randomNum(mnemonic)
    if (arr.includes(mnemonicNum)) {
        return checkRandomArr(arr, mnemonic)
    } else {
        return mnemonicNum
    }
}

function randomNum(mnemonic) {
    return Math.floor(Math.random() * (mnemonic.length))
}

function buf2hex(buffer) {
    // buffer is an ArrayBuffer
    // create a byte array (Uint8Array) that we can use to read the array buffer
    const byteArray = new Uint8Array(buffer);

    // for each element, we want to get its two-digit hexadecimal representation
    const hexParts = [];
    for (let i = 0; i < byteArray.length; i++) {
        // convert value to hexadecimal
        const hex = byteArray[i].toString(16);

        // pad with zeros to length 2
        const paddedHex = ('00' + hex).slice(-2);

        // push to array
        hexParts.push(paddedHex);
    }

    // join all the hex values of the elements into a single string
    return hexParts.join('');
}
