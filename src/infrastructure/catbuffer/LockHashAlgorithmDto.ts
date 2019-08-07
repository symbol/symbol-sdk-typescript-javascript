// tslint:disable: jsdoc-format
/**
*** Copyright (c) 2016-present,
*** Jaguar0625, gimre, BloodyRookie, Tech Bureau, Corp. All rights reserved.
***
*** This file is part of Catapult.
***
*** Catapult is free software: you can redistribute it and/or modify
*** it under the terms of the GNU Lesser General Public License as published by
*** the Free Software Foundation, either version 3 of the License, or
*** (at your option) any later version.
***
*** Catapult is distributed in the hope that it will be useful,
*** but WITHOUT ANY WARRANTY; without even the implied warranty of
*** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*** GNU Lesser General Public License for more details.
***
*** You should have received a copy of the GNU Lesser General Public License
*** along with Catapult. If not, see <http://www.gnu.org/licenses/>.
**/


/** Enumeration of lock hash algorithms. */
export enum LockHashAlgorithmDto {
    /** Input is hashed using sha-3 256. */
    SHA3_256 = 0,
    /** Input is hashed using keccak 256. */
    KECCAK_256 = 1,
    /** Input is hashed twice: first with sha-256 and then with ripemd-160 (bitcoin's OP_HASH160). */
    HASH_160 = 2,
    /** Input is hashed twice with sha-256 (bitcoin's OP_HASH256). */
    HASH_256 = 3,
}
