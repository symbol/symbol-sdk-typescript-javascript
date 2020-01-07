import {TransferTransaction} from "nem2-sdk";

const transferTransactionDTO = {
 meta: {
  height: '78',
  hash: '533243B8575C4058F894C453160AFF055A4A905978AC331460F44104D831E4AC',
  merkleComponentHash: '533243B8575C4058F894C453160AFF055A4A905978AC331460F44104D831E4AC',
  index: 0,
  id: '5CD2B76B2B3F0F0001751380',
 },
 transaction: {
  signature: '7442156D839A3AC900BC0299E8701ECDABA674DCF91283223450953B005DE72C538EA54236F5E089530074CE78067CD3325CF53750B9118154C08B20A5CDC00D',
  signerPublicKey: '2FC3872A792933617D70E02AFF8FBDE152821A0DF0CA5FB04CB56FC3D21C8863',
  version: 1,
  network: 144,
  type: 16724,
  maxFee: '0',
  deadline: '1000',
  recipientAddress: '906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB',
  message: {
   payload: '746573742D6D657373616765',
   type: 0,
  },
  mosaics: [
   {
    id: '85BBEA6CC462B244',
    amount: '10',
   },
  ],
 },
};

const transferWithNamespaceAsRecipientDTO = {
 "meta": {"height": "100800", "hash": "1A8F60B1E81016B7FB23ABE16CC7A95FB5AEE4B41408CBB0730708FC24F6B0DA", "merkleComponentHash": "1A8F60B1E81016B7FB23ABE16CC7A95FB5AEE4B41408CBB0730708FC24F6B0DA", "index": 0, "id": "5E0950F75E191A2D75576388"}, "transaction": {"signature": "EAEAA678BA7560A0A759B1BA89BA71622AF60A73102C4C0774EEF9059FB8B37B888BF49583D242C6276342AD5979F137B54B128F6FBF661FD751E3CA99C75A03", "signerPublicKey": "7B05E175646E759D9A484A8E2E100DBAB66A42F7D0D628EF94CC585B41741182", "version": 1, "network": 152, "type": 16724, "maxFee": "100000", "deadline": "4249241667", "recipientAddress": "99685250A15E486A8E00000000000000000000000000000000", "message": {"type": 0, "payload": ""}, "mosaics": [{"id": "40C7E8943625E66A", "amount": "2"}, {"id": "75AF035421401EF0", "amount": "2000000"}]}
}

// @ts-ignore
import {CreateTransactionFromDTO} from "nem2-sdk/dist/src/infrastructure/transaction/CreateTransactionFromDTO";

export const transfer = CreateTransactionFromDTO(transferTransactionDTO) as TransferTransaction;

export const transferWithNamespaceAsRecipient = CreateTransactionFromDTO(transferWithNamespaceAsRecipientDTO) as TransferTransaction;