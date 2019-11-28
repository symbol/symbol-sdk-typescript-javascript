import seedImg from "@/common/img/login/seed.png"
import trezorImg from "@/common/img/login/trezor.png"
import ledgerImg from "@/common/img/login/ledger.png"

import importStepImage1 from '@/common/img/login/1_4.png'
import importStepImage2 from '@/common/img/login/2_4.png'
import importStepImage3 from '@/common/img/login/3_4.png'
import importStepImage4 from '@/common/img/login/4_4.png'

import createStepImage1 from '@/common/img/login/1_5.png'
import createStepImage2 from '@/common/img/login/2_5.png'
import createStepImage3 from '@/common/img/login/3_5.png'
import createStepImage4 from '@/common/img/login/4_5.png'
import createStepImage5 from '@/common/img/login/5_5.png'


export const importInfoList = [
    {
        image: seedImg,
        title: "Import_Seed",
        description: "Import_Mnemonic_phrase_directly_to_make_an_account",
        link: "importAccount",
    },
    {
        image: trezorImg,
        title: "Access_Trezor",
        description: "Access_your_trezor_wallet_to_make_trezor_account",
        link: null,
    },
    {
        image: ledgerImg,
        title: "Access_Ledger",
        description: "Access_your_ledger_wallet_to_make_ledge_account",
        link: null,
    }
]

export const createStepBarTitleList = [
    'Create Account',
    'Generate Mnemonic',
    'BackUp Mnemonic Phrase',
    'Verify Mnemonic phrase',
    'Finished'
]

export const importStepBarTitleList = [
    'Create Account',
    'Type Mnemonic Phrase',
    'Choose Wallets',
    'Finished'
]

export const importStepImage = {
    importStepImage1,
    importStepImage2,
    importStepImage3,
    importStepImage4,
}

export const createStepImage = {
    createStepImage1,
    createStepImage2,
    createStepImage3,
    createStepImage4,
    createStepImage5,
}
