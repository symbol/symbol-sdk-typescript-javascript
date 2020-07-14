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
import { expect } from 'chai';
import { Order, PositionEnum, BlockOrderByEnum, AccountOrderByEnum } from 'symbol-openapi-typescript-fetch-client';
import { Order as OrderModel } from '../../../src/infrastructure/searchCriteria/Order';
import { DtoMapping } from '../../../src/core/utils/DtoMapping';
import { BlockOrderBy } from '../../../src/infrastructure/searchCriteria/BlockOrderBy';
import { MerklePosition } from '../../../src/model/blockchain/MerklePosition';
import { AccountOrderBy } from '../../../src/infrastructure/searchCriteria/AccountOrderBy';

describe('Order', () => {
    it('should be able to map Order', () => {
        const value1: Order = Order.Asc;
        const value2: OrderModel = DtoMapping.mapEnum(value1);
        expect(value2).eq(OrderModel.Asc);
    });
    it('should be able to map Order when undefined', () => {
        const value1: Order | undefined = undefined;
        const value2: OrderModel = DtoMapping.mapEnum(value1);
        expect(value2).eq(undefined);
    });
    it('should be able to map OrderModel', () => {
        const value1: OrderModel = OrderModel.Asc;
        const value2: Order = DtoMapping.mapEnum(value1);
        expect(value2).eq(Order.Asc);
    });
    it('should be able to map OrderModel when undefined', () => {
        const value1: OrderModel | undefined = undefined;
        const value2: Order = DtoMapping.mapEnum(value1);
        expect(value2).eq(undefined);
    });
    it('openAPI sanity check', () => {
        for (const item in Order) {
            const value: OrderModel = DtoMapping.mapEnum(item);
            expect(value).not.to.be.undefined;
        }
    });
});

describe('BlockOrderBy', () => {
    it('should be able to map BlockOrderByEnum', () => {
        const value1: BlockOrderByEnum = BlockOrderByEnum.Id;
        const value2: BlockOrderBy = DtoMapping.mapEnum(value1);
        expect(value2).eq(BlockOrderBy.Id);
    });
    it('should be able to map BlockOrderBy when undefined', () => {
        const value1: BlockOrderByEnum | undefined = undefined;
        const value2: BlockOrderBy = DtoMapping.mapEnum(value1);
        expect(value2).eq(undefined);
    });
    it('should be able to map BlockOrderBy', () => {
        const value1: BlockOrderBy = BlockOrderBy.Height;
        const value2: Order = DtoMapping.mapEnum(value1);
        expect(value2).eq(BlockOrderByEnum.Height);
    });
    it('should be able to map BlockOrderBy when undefined', () => {
        const value1: BlockOrderBy | undefined = undefined;
        const value2: BlockOrderByEnum = DtoMapping.mapEnum(value1);
        expect(value2).eq(undefined);
    });
    it('openAPI sanity check', () => {
        for (const item in BlockOrderByEnum) {
            const value: BlockOrderBy = DtoMapping.mapEnum(item);
            expect(value).not.to.be.undefined;
        }
    });
});

describe('AccountOrderBy', () => {
    it('should be able to map AccountOrderByEnum', () => {
        const value1: AccountOrderByEnum = AccountOrderByEnum.Id;
        const value2: AccountOrderBy = DtoMapping.mapEnum(value1);
        expect(value2).eq(AccountOrderBy.Id);
    });
    it('should be able to map AccountOrderBy when undefined', () => {
        const value1: AccountOrderByEnum | undefined = undefined;
        const value2: AccountOrderBy = DtoMapping.mapEnum(value1);
        expect(value2).eq(undefined);
    });
    it('should be able to map AccountOrderBy', () => {
        const value1: AccountOrderBy = AccountOrderBy.Balance;
        const value2: Order = DtoMapping.mapEnum(value1);
        expect(value2).eq(AccountOrderByEnum.Balance);
    });
    it('should be able to map AccountOrderBy when undefined', () => {
        const value1: AccountOrderBy | undefined = undefined;
        const value2: AccountOrderByEnum = DtoMapping.mapEnum(value1);
        expect(value2).eq(undefined);
    });
    it('should be able to map AccountOrderBy', () => {
        const value1: AccountOrderBy = AccountOrderBy.Importance;
        const value2: Order = DtoMapping.mapEnum(value1);
        expect(value2).eq(AccountOrderByEnum.Importance);
    });
    it('openAPI sanity check', () => {
        for (const item in AccountOrderByEnum) {
            const value: AccountOrderBy = DtoMapping.mapEnum(item);
            expect(value).not.to.be.undefined;
        }
    });
});

describe('MerklePosition', () => {
    it('should be able to map MerklePosition', () => {
        const value1: PositionEnum = PositionEnum.Left;
        const value2: MerklePosition = DtoMapping.mapEnum(value1);
        expect(value2).eq(MerklePosition.Left);
    });
    it('should be able to map MerklePosition when undefined', () => {
        const value1: BlockOrderByEnum | undefined = undefined;
        const value2: MerklePosition = DtoMapping.mapEnum(value1);
        expect(value2).eq(undefined);
    });
    it('should be able to map MerklePosition', () => {
        const value1: MerklePosition = MerklePosition.Right;
        const value2: Order = DtoMapping.mapEnum(value1);
        expect(value2).eq(PositionEnum.Right);
    });
    it('should be able to map MerklePosition when undefined', () => {
        const value1: MerklePosition | undefined = undefined;
        const value2: PositionEnum = DtoMapping.mapEnum(value1);
        expect(value2).eq(undefined);
    });
    it('openAPI sanity check', () => {
        for (const item in PositionEnum) {
            const value: MerklePosition = DtoMapping.mapEnum(item);
            expect(value).not.to.be.undefined;
        }
    });
});
