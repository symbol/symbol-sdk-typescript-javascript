/*
 * Copyright 2019 NEM
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

import { Duration } from '@js-joda/core';
import {
    AccountRestrictionsInfoDTO,
    MerkleStateInfoDTO,
    MerkleTreeBranchDTO,
    MerkleTreeLeafDTO,
} from 'symbol-openapi-typescript-fetch-client';
import { Address } from '../../model/account/Address';
import { MerkleStateInfo } from '../../model/blockchain/MerkleStateInfo';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { AccountRestriction } from '../../model/restriction/AccountRestriction';
import { AccountRestrictions } from '../../model/restriction/AccountRestrictions';
import { AddressRestrictionFlag } from '../../model/restriction/AddressRestrictionFlag';
import { MosaicRestrictionFlag } from '../../model/restriction/MosaicRestrictionFlag';
import { OperationRestrictionFlag } from '../../model/restriction/OperationRestrictionFlag';
import { MerkleTree } from '../../model/state/MerkleTree';
import { MerkleTreeBranch } from '../../model/state/MerkleTreeBranch';
import { MerkleTreeBranchLink } from '../../model/state/MerkleTreeBranchLink';
import { MerkleTreeLeaf } from '../../model/state/MerkleTreeLeaf';
import { MerkleTreeNodeType } from '../../model/state/MerkleTreeNodeType';

export class DtoMapping {
    /**
     * Create AccountRestrictionsInfo class from Json.
     * @param accountRestrictions.
     * @returns {module: model/Account/AccountRestrictions} The AccountRestrictionsInfo class.
     */
    public static extractAccountRestrictionFromDto(accountRestrictions: AccountRestrictionsInfoDTO): AccountRestrictions {
        return new AccountRestrictions(
            accountRestrictions.accountRestrictions.version || 1,
            accountRestrictions['id'],
            Address.createFromEncoded(accountRestrictions.accountRestrictions.address),
            accountRestrictions.accountRestrictions.restrictions.map((prop) => {
                const restrictionFlags = prop.restrictionFlags as number;
                switch (restrictionFlags) {
                    case AddressRestrictionFlag.AllowIncomingAddress:
                    case AddressRestrictionFlag.BlockIncomingAddress:
                    case AddressRestrictionFlag.AllowOutgoingAddress:
                    case AddressRestrictionFlag.BlockOutgoingAddress:
                        return new AccountRestriction(
                            restrictionFlags,
                            prop.values.map((value) => Address.createFromEncoded(value as string)),
                        );
                    case MosaicRestrictionFlag.AllowMosaic:
                    case MosaicRestrictionFlag.BlockMosaic:
                        return new AccountRestriction(
                            restrictionFlags,
                            prop.values.map((value) => new MosaicId(value as string)),
                        );
                    case OperationRestrictionFlag.AllowOutgoingTransactionType:
                    case OperationRestrictionFlag.BlockOutgoingTransactionType:
                        return new AccountRestriction(
                            restrictionFlags,
                            prop.values.map((value) => value as number),
                        );
                    default:
                        throw new Error(`Invalid restriction type: ${restrictionFlags}`);
                }
            }),
        );
    }

    /**
     * Creates a copy of the first object adding the attributes of the second object.
     * @param object the object to be cloned
     * @param attributes the extra attributes to be added to the object.
     * @returns a copy of the first object with the new attributes added.
     */
    public static assign<T>(object: T, attributes: any): T {
        return Object.assign({ __proto__: Object.getPrototypeOf(object) }, object, attributes);
    }

    /**
     * Map one enum type to another by value
     * @param value enum value to be mapped
     */
    public static mapEnum<E1, E2>(value: E1 | undefined): E2 {
        return (value as unknown) as E2;
    }

    /**
     * It parse a server time/duration configuration like: - 1000ms 1000 milliseconds - 15s 15 seconds
     * - 5m 5 minutes - 2h 2 hours - 10d 10 days
     *
     * <p>into a @{@link Duration} object
     *
     * @param serverValue time.
     * @return {Duration} an instant from that value.
     */
    public static parseServerDuration(serverValue: string): Duration {
        const preprocessedValue = serverValue.replace(`'`, '').trim();
        const patten = `([0-9]+)([hdms]+)[:\\s]?`;
        const regex = new RegExp(patten, 'g');

        // if the input doesn't match the patten, don't bother to do loop
        if (!preprocessedValue.match(patten)) {
            throw new Error('Duration value format is not recognized.');
        }

        let duration = Duration.ofSeconds(0);
        let match;
        const types: string[] = [];
        let matchGroups = '';
        while ((match = regex.exec(preprocessedValue))) {
            if (!match) {
                throw new Error('Duration value format is not recognized.');
            }
            const num = parseInt(match[1]);
            const type = match[2];

            // Added check make sure no duplicated types
            if (types.indexOf(type) >= 0 || !match || match.length !== 3) {
                throw new Error('Duration value format is not recognized.');
            }
            types.push(type);

            switch (type) {
                case 'ms':
                    duration = duration.plusMillis(num);
                    break;
                case 's':
                    duration = duration.plusSeconds(num);
                    break;
                case 'm':
                    duration = duration.plusMinutes(num);
                    break;
                case 'h':
                    duration = duration.plusHours(num);
                    break;
                case 'd':
                    duration = duration.plusDays(num);
                    break;
                default:
                    throw new Error('Duration value format is not recognized.');
            }
            matchGroups += match[0];
        }
        if (!types.length || matchGroups !== preprocessedValue) {
            throw new Error('Duration value format is not recognized.');
        }
        return duration;
    }

    /**
     *
     * It converts a server Hex like 0x017D'1694'0477'B3F5 to 017D16940477B3F5
     *
     * @param serverHex
     */
    public static toSimpleHex(serverHex: string): string {
        return serverHex.split("'").join('').replace(/^(0x)/, '');
    }

    /**
     * Creates the MerkleStateInfo from the dto
     * @param dto the dto
     */
    public static toMerkleStateInfo(dto: MerkleStateInfoDTO): MerkleStateInfo {
        if (!dto.tree) {
            return new MerkleStateInfo(dto.raw, MerkleTree.fromRaw(dto.raw));
        }

        const leaf = dto.tree.find((tree) => tree.type.valueOf() === MerkleTreeNodeType.Leaf) as MerkleTreeLeafDTO;
        const tree = new MerkleTree(
            dto.tree
                .filter((tree) => tree.type.valueOf() === MerkleTreeNodeType.Branch)
                .map((b) => {
                    const branch = b as MerkleTreeBranchDTO;
                    return new MerkleTreeBranch(
                        branch.type.valueOf(),
                        branch.path,
                        branch.encodedPath,
                        branch.nibbleCount,
                        branch.linkMask,
                        branch.links.map((link) => new MerkleTreeBranchLink(link.bit, link.link)),
                        branch.branchHash,
                    );
                }),
            leaf
                ? new MerkleTreeLeaf(leaf.type.valueOf(), leaf.path, leaf.encodedPath, leaf.nibbleCount, leaf.value, leaf.leafHash)
                : undefined,
        );
        return new MerkleStateInfo(dto.raw, tree);
    }
}
