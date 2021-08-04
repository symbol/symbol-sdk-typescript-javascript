/*
 * Copyright 2020 NEM
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

import { MultisigAccountGraphInfo } from '../../model/account/MultisigAccountGraphInfo';
import { MultisigAccountInfo } from '../../model/account/MultisigAccountInfo';

/**
 * MultisigGraph utilities
 */

// Type for Multisig Tree children Object
export type MultisigChildrenTreeObject = {
    address: string;
    children: []; // children array.
};

export class MultisigGraphUtils {
    /**
     * creates a structred Tree object containing Current multisig account with children
     *@param {MultisigAccountInfo[][]} multisigEnteries
     *@returns {MultisigChildrenTreeObject[]} Array of multisigChildrentTree objects
     */
    public static getMultisigChildren(multisigAccountGraphInfoMapped: MultisigAccountInfo[][]): MultisigChildrenTreeObject[] {
        if (multisigAccountGraphInfoMapped) {
            const mappedTree: MultisigChildrenTreeObject[] = [];
            multisigAccountGraphInfoMapped.forEach((level: MultisigAccountInfo[]) => {
                level.forEach((entry: MultisigAccountInfo) => {
                    mappedTree.push({
                        address: entry.accountAddress.plain(),
                        children: [],
                    });
                    // find the entry matching with address matching cosignatory address and update his children
                    const updateRecursively = (address: string, object: MultisigChildrenTreeObject) => (obj): any => {
                        if (obj.address === address) {
                            obj.children.push(object);
                        } else if (obj.children) {
                            obj.children.forEach(updateRecursively(address, object));
                        }
                    };
                    entry.cosignatoryAddresses.forEach((addressVal) => {
                        mappedTree.forEach(
                            updateRecursively(addressVal['address'], {
                                address: entry.accountAddress.plain(),
                                children: [],
                            }),
                        );
                    });
                });
            });
            return mappedTree;
        }
        return [];
    }
    /**
     * sort entries based on tree hierarchy from top to bottom
     *@param {Map<number, MultisigAccountInfo[]>} multisigEnteries
     *@returns {MultisigAccountInfo[]}  sorted multisig graph
     */
    private static getMultisigGraphArraySorted(multisigEntries: Map<number, MultisigAccountInfo[]>): MultisigAccountInfo[][] {
        return [...multisigEntries.keys()]
            .sort((a, b) => b - a) // Get addresses from top to bottom
            .map((key) => multisigEntries.get(key) || [])
            .filter((x) => x.length > 0);
    }
    /**
     * returns sorted tree entries
     *@param {MultisigAccountGraphInfo} graphInfo
     *@returns {MultisigAccountInfo[][]}  array of sorted multisigInfo
     */
    public static getMultisigInfoFromMultisigGraphInfo(graphInfo: MultisigAccountGraphInfo): MultisigAccountInfo[][] {
        const { multisigEntries } = graphInfo;
        return [...this.getMultisigGraphArraySorted(multisigEntries)].map((item) => item);
    }
}
