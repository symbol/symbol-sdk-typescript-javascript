import {FormattedTransfer} from '@/core/model/formattedTransactions/FormattedTransfer.ts'
import {TransferTransaction, Deadline, Address, PlainMessage, NetworkType, Mosaic, MosaicId, UInt64, NamespaceId} from 'nem2-sdk'
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {transfer, transferWithNamespaceAsRecipient} from '@MOCKS/index'
import {AppWallet} from '@/core/model'

const unsignedTransfer = TransferTransaction.create(
  Deadline.create(),
  Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
  [],
  PlainMessage.create('test-message'),
  NetworkType.MIJIN_TEST,
)

const mockGetTimeFromBlockNumber = jest.fn()
const mockNetworkProperties = {
  getTimeFromBlockNumber: (...args) => mockGetTimeFromBlockNumber(args),
}

const mockStore = {
  state: {
    account: {
      networkCurrency: mockNetworkCurrency,
      wallet: AppWallet.createFromDTO(MultisigWallet),
    },
    app: {
      networkProperties: mockNetworkProperties,
    },
  },
}
describe('FormattedTransfer', () => {
  it('should render an unsigned transfer data', () => {
    const formattedTransfer = new FormattedTransfer(
      unsignedTransfer,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransfer.dialogDetailMap).toEqual({
      transaction_type: 'payment',
      from: null,
      aims: 'SBILTA-367K2L-X2FEXG-5TFWAS-7GEFYA-GY7QLF-BYKC',
      fee: 0,
      block: undefined,
      hash: undefined,
      message: 'test-message',
      mosaics: [],
    })
  })

  it('should render an signed transfer data', () => {
    const formattedTransfer = new FormattedTransfer(
      transfer,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransfer.dialogDetailMap).toEqual({
      transaction_type: 'payment',
      from: 'SBMYYF-IM6VGG-45KWGS-ZLSXFH-P74WVT-7MOF6U-YBHT',
      aims: 'SBSBLB-T7CIOQ-G6XUI7-TRDMHV-4TKS5O-7QM3MW-QYHL',
      fee: 0,
      block: 78,
      hash: '533243B8575C4058F894C453160AFF055A4A905978AC331460F44104D831E4AC',
      message: 'test-message',
      mosaics: [new Mosaic(new MosaicId('85BBEA6CC462B244'), UInt64.fromUint(10))],
    })
  })


  it('should render an signed transfer data', () => {
    const formattedTransfer = new FormattedTransfer(
      transferWithNamespaceAsRecipient,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransfer.dialogDetailMap).toEqual({
      transaction_type: 'payment',
      from: 'TCBIA2-4P5GO4-QNI6H2-TIRPXA-LWF7UK-HPI6QO-OVDM',
      aims: new NamespaceId([ 2706395752, 2389330014 ]),
      fee: 0.1,
      block: 100800,
      hash: '1A8F60B1E81016B7FB23ABE16CC7A95FB5AEE4B41408CBB0730708FC24F6B0DA',
      message: '',
      mosaics: [
        new Mosaic(new MosaicId('40C7E8943625E66A'), UInt64.fromUint(2)),
        new Mosaic(new MosaicId('75AF035421401EF0'), UInt64.fromUint(2000000)),
      ],
    })
  })
})
