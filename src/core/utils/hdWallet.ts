import {ExtendedKey, MnemonicPassPhrase, Wallet} from "nem2-hd-wallets"

export const createMnemonic = () => {
    const mnemonic = MnemonicPassPhrase.createRandom('english')
    return mnemonic.plain
}

export const getPath = (int: number): string => {
    if (int === null || int === undefined) {
        throw new Error('invalid argument provided to getPath')
    }
    return  `m/44'/43'/${int}'/0'/0'`
}

export const createSubWalletByPathNumber = (mnemonic: string, pathNumber: number) => {
    const path = getPath(pathNumber)
    const PassPhrase = new MnemonicPassPhrase(mnemonic)
    const bip32Node = ExtendedKey.createFromSeed(PassPhrase.toEntropy())
    const wallet = new Wallet(bip32Node.derivePath(path))
    const account = wallet.getAccount()
    return account
}

export const randomizeMnemonicWordArray = (array: string[]): string[] => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}
