/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    AccountKeyTypeFlagsDto,
    AccountStateBuilder,
    AccountStateFormatDto,
    AddressDto,
    AmountDto,
    FinalizationEpochDto,
    HeightActivityBucketBuilder,
    HeightActivityBucketsBuilder,
    HeightDto,
    ImportanceDto,
    ImportanceHeightDto,
    ImportanceSnapshotBuilder,
    KeyDto,
    MosaicBuilder,
    PinnedVotingKeyBuilder,
    VotingKeyDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { Mosaic, MosaicId } from '../mosaic';
import { UInt64 } from '../UInt64';
import { AccountLinkVotingKey } from './AccountLinkVotingKey';
import { AccountType } from './AccountType';
import { ActivityBucket } from './ActivityBucket';
import { Address } from './Address';
import { PublicAccount } from './PublicAccount';
import { SupplementalPublicKeys } from './SupplementalPublicKeys';

/**
 * The account info structure describes basic information for an account.
 */
export class AccountInfo {
    constructor(
        /**
         * Version
         */
        public readonly version: number,
        /**
         * The database record id;
         */
        public readonly recordId: string,
        /**
         * Address of the account.
         */
        public readonly address: Address,
        /**
         * Height when the address was published.
         */
        public readonly addressHeight: UInt64,
        /**
         * Public key of the account.
         */
        public readonly publicKey: string,
        /**
         * Height when the public key was published.
         */
        public readonly publicKeyHeight: UInt64,
        /**
         * Account type
         */
        public readonly accountType: AccountType,
        /**
         * Account keys
         */
        public readonly supplementalPublicKeys: SupplementalPublicKeys,
        /**
         * Account activity bucket
         */
        public readonly activityBucket: ActivityBucket[],
        /**
         * Mosaics held by the account.
         */
        public readonly mosaics: Mosaic[],
        /**
         * Importance of the account.
         */
        public readonly importance: UInt64,
        /**
         * Importance height of the account.
         */
        public readonly importanceHeight: UInt64,
    ) {}

    /**
     * Returns account public account.
     * @returns {PublicAccount}
     */
    get publicAccount(): PublicAccount {
        return PublicAccount.createFromPublicKey(this.publicKey, this.address.networkType);
    }

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        const address: AddressDto = this.address.toBuilder();
        const addressHeight: HeightDto = new HeightDto(this.addressHeight.toDTO());
        const publicKey: KeyDto = new KeyDto(Convert.hexToUint8(this.publicKey));
        const publicKeyHeight: HeightDto = new HeightDto(this.publicKeyHeight.toDTO());
        const accountType = this.accountType.valueOf();
        const supplementalPublicKeysMask = this.getAccountKeyTypeFlags();
        const votingPublicKeys: PinnedVotingKeyBuilder[] =
            this.supplementalPublicKeys.voting?.map((key) => AccountInfo.toPinnedVotingKeyBuilder(key)) || [];
        const balances: MosaicBuilder[] = this.mosaics.map((m) => AccountInfo.toMosaicBuilder(m));
        const linkedPublicKey: KeyDto | undefined = AccountInfo.toKeyDto(this?.supplementalPublicKeys?.linked?.publicKey);
        const nodePublicKey = AccountInfo.toKeyDto(this?.supplementalPublicKeys?.node?.publicKey);
        const vrfPublicKey = AccountInfo.toKeyDto(this?.supplementalPublicKeys?.vrf?.publicKey);
        const importanceSnapshots: ImportanceSnapshotBuilder = new ImportanceSnapshotBuilder(
            new ImportanceDto(this.importance.toDTO()),
            new ImportanceHeightDto(this.importanceHeight.toDTO()),
        );
        const activityBuckets: HeightActivityBucketsBuilder = new HeightActivityBucketsBuilder(
            this.activityBucket.slice(0, 5).map((b) => AccountInfo.toHeightActivityBucketsBuilder(b)),
        );
        const format = this.isHighValue() ? AccountStateFormatDto.HIGH_VALUE : AccountStateFormatDto.REGULAR;
        return new AccountStateBuilder(
            this.version,
            address,
            addressHeight,
            publicKey,
            publicKeyHeight,
            accountType,
            format,
            supplementalPublicKeysMask,
            linkedPublicKey,
            nodePublicKey,
            vrfPublicKey,
            votingPublicKeys,
            importanceSnapshots,
            activityBuckets,
            balances,
        ).serialize();
    }

    private isHighValue(): boolean {
        if (this.importance.compare(UInt64.fromUint(0)) == 0) {
            return false;
        }
        if (this.activityBucket.length < 5) {
            return false;
        }
        return true;
    }

    /**
     * Get the mosaic flags.
     *
     * @return Mosaic flags
     */
    private getAccountKeyTypeFlags(): AccountKeyTypeFlagsDto[] {
        const flags: AccountKeyTypeFlagsDto[] = [];
        if (this.supplementalPublicKeys.vrf) {
            flags.push(AccountKeyTypeFlagsDto.VRF);
        }
        if (this.supplementalPublicKeys.node) {
            flags.push(AccountKeyTypeFlagsDto.NODE);
        }
        if (this.supplementalPublicKeys.linked) {
            flags.push(AccountKeyTypeFlagsDto.LINKED);
        }
        return flags;
    }

    private static toPinnedVotingKeyBuilder(key: AccountLinkVotingKey): PinnedVotingKeyBuilder {
        const votingKeyDto = new VotingKeyDto(Convert.hexToUint8(key.publicKey).slice(0, 32));
        const startEpoch: FinalizationEpochDto = new FinalizationEpochDto(key.startEpoch);
        const endEpoch: FinalizationEpochDto = new FinalizationEpochDto(key.endEpoch);
        return new PinnedVotingKeyBuilder(votingKeyDto, startEpoch, endEpoch);
    }

    private static toMosaicBuilder(m: Mosaic): MosaicBuilder {
        return new MosaicBuilder((m.id as MosaicId).toBuilder(), new AmountDto(m.amount.toDTO()));
    }

    private static toKeyDto(publicKey: string | undefined): KeyDto | undefined {
        if (!publicKey) {
            return undefined;
        }
        return new KeyDto(Convert.hexToUint8(publicKey));
    }

    private static toHeightActivityBucketsBuilder(b: ActivityBucket): HeightActivityBucketBuilder {
        const startHeight: ImportanceHeightDto = new ImportanceHeightDto(b.startHeight.toDTO());
        /** Total fees paid by account. */
        const totalFeesPaid: AmountDto = new AmountDto(b.totalFeesPaid.toDTO());
        /** Number of times account has been used as a beneficiary. */
        const beneficiaryCount: number = b.beneficiaryCount;
        /** Raw importance score. */
        const rawScore: number[] = b.rawScore.toDTO();
        return new HeightActivityBucketBuilder(startHeight, totalFeesPaid, beneficiaryCount, rawScore);
    }
}
