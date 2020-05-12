export const getDummyNetworkProperties = (): any => {
    return JSON.parse(`{
      "network": {
        "identifier": "public-test",
        "nodeEqualityStrategy": "public-key",
        "publicKey": "86E8FDE6F3FE540ADC1B3A78DFA9B9E735736FC520E0D9C9CD4ADD3255CD9605",
        "generationHashSeed": "E759C7C56FD20021C8F0CC7FF5F108A2FEBA3312F6EC6D6A702DF87657FEC55C",
        "epochAdjustment": "1573430400s"
      },
      "chain": {
        "enableVerifiableState": true,
        "enableVerifiableReceipts": true,
        "currencyMosaicId": "0x605E'BB80'8E3A'21C6",
        "harvestingMosaicId": "0x501C'4C79'2FEB'D419",
        "blockGenerationTargetTime": "15s",
        "blockTimeSmoothingFactor": "3000",
        "importanceGrouping": "1433",
        "importanceActivityPercentage": "5",
        "maxRollbackBlocks": "398",
        "maxDifficultyBlocks": "60",
        "defaultDynamicFeeMultiplier": "1'000",
        "maxTransactionLifetime": "24h",
        "maxBlockFutureTime": "500ms",
        "initialCurrencyAtomicUnits": "8'998'999'998'000'000",
        "maxMosaicAtomicUnits": "9'000'000'000'000'000",
        "totalChainImportance": "15'000'000",
        "minHarvesterBalance": "500",
        "maxHarvesterBalance": "50'000'000'000'000",
        "harvestBeneficiaryPercentage": "10",
        "blockPruneInterval": "360",
        "maxTransactionsPerBlock": "6'000"
      },
      "plugins": {
        "accountlink": {
          "dummy": "to trigger plugin load"
        },
        "aggregate": {
          "maxTransactionsPerAggregate": "1'000",
          "maxCosignaturesPerAggregate": "25",
          "enableStrictCosignatureCheck": false,
          "enableBondedAggregateSupport": true,
          "maxBondedTransactionLifetime": "48h"
        },
        "lockhash": {
          "lockedFundsPerAggregate": "10'000'000",
          "maxHashLockDuration": "2d"
        },
        "locksecret": {
          "maxSecretLockDuration": "30d",
          "minProofSize": "1",
          "maxProofSize": "1000"
        },
        "metadata": {
          "maxValueSize": "1024"
        },
        "mosaic": {
          "maxMosaicsPerAccount": "1'000",
          "maxMosaicDuration": "3650d",
          "maxMosaicDivisibility": "6",
          "mosaicRentalFeeSinkPublicKey": "53E140B5947F104CABC2D6FE8BAEDBC30EF9A0609C717D9613DE593EC2A266D3",
          "mosaicRentalFee": "500"
        },
        "multisig": {
          "maxMultisigDepth": "3",
          "maxCosignatoriesPerAccount": "25",
          "maxCosignedAccountsPerAccount": "25"
        },
        "namespace": {
          "maxNameSize": "64",
          "maxChildNamespaces": "256",
          "maxNamespaceDepth": "3",
          "minNamespaceDuration": "1m",
          "maxNamespaceDuration": "365d",
          "namespaceGracePeriodDuration": "30d",
          "reservedRootNamespaceNames": "xem, nem, user, account, org, com, biz, net, edu, mil, gov, info",
          "namespaceRentalFeeSinkPublicKey": "3E82E1C1E4A75ADAA3CBA8C101C3CD31D9817A2EB966EB3B511FB2ED45B8E262",
          "rootNamespaceRentalFeePerBlock": "1",
          "childNamespaceRentalFee": "100"
        },
        "restrictionaccount": {
          "maxAccountRestrictionValues": "512"
        },
        "restrictionmosaic": {
          "maxMosaicRestrictionValues": "20"
        },
        "transfer": {
          "maxMessageSize": "1024"
        }
      }
    }`);
};
