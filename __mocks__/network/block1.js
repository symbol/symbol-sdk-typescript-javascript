import {BlockInfo, UInt64, PublicAccount, NetworkType} from "nem2-sdk";
import {extractBeneficiary} from "nem2-sdk/dist/src/infrastructure/transaction/CreateTransactionFromDTO";
const blockDTO = {
  meta: {
    hash: "2ECFEE3F13AAAD4EACE41647224781EE9B0086EBDB0EB66714C8A826A56445B8",
    generationHash:
      "6C0350A10724FC325A1F06CEFC4CA14464BC472F566842D22418AEE0F8746B4C",
    totalFee: "0",
    stateHashSubCacheMerkleRoots: [],
    numTransactions: 25
  },
  block: {
    signature:
      "E7D075128627D5625E82AF95DACC89860E1183FCD580F460FCE0C6232F94C2D2D080964BEDD9E10B94B6DFE4225EDF90764D0F3302F0FDFCD55017B6442D6409",
    signerPublicKey:
      "D33212292076DF6F87CFA8B81887FDA2657BBC37CBA183798F43DC27380F75A7",
    version: 1,
    network: 152,
    type: 32835,
    height: "1",
    timestamp: "0",
    difficulty: "100000000000000",
    feeMultiplier: 0,
    previousBlockHash:
      "0000000000000000000000000000000000000000000000000000000000000000",
    transactionsHash:
      "339DC2060D688D1C327635A1800EAF55F3710F897D5618D70EF24C91AE976579",
    receiptsHash:
      "3043D2341AF1FB32022832EBDCFD7496155FE5B16D8690ACAD6E54653B27EAC6",
    stateHash:
      "4AA9BFC85766CA4477BC95F6353F3002B971876194C59F66997B30B7FAB5A1B0",
    beneficiaryPublicKey:
      "D33212292076DF6F87CFA8B81887FDA2657BBC37CBA183798F43DC27380F75A7"
  }
};

export const block1 = new BlockInfo(
  blockDTO.meta.hash,
  blockDTO.meta.generationHash,
  UInt64.fromNumericString(blockDTO.meta.totalFee),
  blockDTO.meta.numTransactions,
  blockDTO.block.signature,
  PublicAccount.createFromPublicKey(
    blockDTO.block.signerPublicKey,
    NetworkType.TEST_NET
  ),
  NetworkType.TEST_NET,
  parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version
  blockDTO.block.type,
  UInt64.fromNumericString(blockDTO.block.height),
  UInt64.fromNumericString(blockDTO.block.timestamp),
  UInt64.fromNumericString(blockDTO.block.difficulty),
  blockDTO.block.feeMultiplier,
  blockDTO.block.previousBlockHash,
  blockDTO.block.transactionsHash,
  blockDTO.block.receiptsHash,
  blockDTO.block.stateHash,
  extractBeneficiary(blockDTO, NetworkType.TEST_NET)
);
