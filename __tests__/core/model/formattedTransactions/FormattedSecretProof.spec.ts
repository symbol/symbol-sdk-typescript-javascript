import {FormattedSecretProof} from '@/core/model/formattedTransactions/FormattedSecretProof.ts'
import {Deadline, NetworkType, UInt64, SecretProofTransaction, HashType} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet, MultisigAccount} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
const unsignedSecretProofTransaction = SecretProofTransaction.create(
    Deadline.create(),
    HashType.Op_Sha3_256,
    '8472FA74A64A97C85F0A285299D9FD2D44D71CB5698FE9C7E88C33001F9DD83F',
    MultisigAccount.address,
    proof,
    NetworkType.MIJIN_TEST,
    new UInt64([1, 0]),
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

describe('FormattedSecretProof', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedSecretProof(
            unsignedSecretProofTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'secret_proof',
            fee: 0.000001,
            block: undefined,
            hash: undefined,
            hashType: 0,
            proof: 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7',
        })
    })
})
