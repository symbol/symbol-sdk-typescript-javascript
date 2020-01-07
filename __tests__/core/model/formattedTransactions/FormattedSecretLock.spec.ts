import {FormattedSecretLock} from '@/core/model/formattedTransactions/FormattedSecretLock.ts'
import {Deadline, NetworkType, UInt64, Address, SecretLockTransaction, NetworkCurrencyMosaic, HashType} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
const unsignedSecretLockTransaction = SecretLockTransaction.create(
    Deadline.create(),
    NetworkCurrencyMosaic.createAbsolute(10),
    UInt64.fromUint(100),
    HashType.Op_Sha3_256,
    '8472FA74A64A97C85F0A285299D9FD2D44D71CB5698FE9C7E88C33001F9DD83F',
    recipientAddress,
    NetworkType.MIJIN_TEST,
);

const mockGetTimeFromBlockNumber = jest.fn()
const mockNetworkProperties = {
    getTimeFromBlockNumber: (...args) => mockGetTimeFromBlockNumber(args)
}

const mockStore = {
    state: {
        account: {
            networkCurrency: mockNetworkCurrency,
            wallet: AppWallet.createFromDTO(MultisigWallet)
        },
        app: {
            networkProperties: mockNetworkProperties,
        }
    }
}

describe('FormattedSecretLock', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedSecretLock(
            unsignedSecretLockTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'secret_lock',
            fee: 0,
            block: undefined,
            hash: undefined,
            mosaics: [NetworkCurrencyMosaic.createAbsolute(10)],
            duration_blocks: '100',
            hashType: 0,
            secret: '8472FA74A64A97C85F0A285299D9FD2D44D71CB5698FE9C7E88C33001F9DD83F',
            aims: 'SDBDG4-IT43MP-CW2W4C-BBCSJJ-T42AYA-LQN7A4-VVWL',
        })
    })
})
