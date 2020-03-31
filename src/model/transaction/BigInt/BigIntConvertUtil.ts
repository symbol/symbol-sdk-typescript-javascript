import { GeneratorUtils } from 'catbuffer-typescript/builders/GeneratorUtils';
import { Convert } from '../../../core/format/Convert';

export class BigIntConvertUtil {
    /**
     * Convert BitInt to 8 byte hex string
     * @param input BigInt value
     * @returns {string}
     */
    public static BigIntToHex(input: BigInt): string {
        return input.toString(16).padStart(16, '0');
    }

    /**
     * Convert BigInt to buffer array
     * @param input BigInt value
     * @returns {Uint8Array}
     */
    public static BigIntToUint8(input: BigInt): Uint8Array {
        const hex = BigIntConvertUtil.BigIntToHex(input);
        const len = hex.length / 2;
        const uint8 = new Uint8Array(len);

        let i = 0;
        let j = 0;
        while (i < len) {
            uint8[i] = parseInt(hex.slice(j, j + 2), 16);
            i += 1;
            j += 2;
        }

        return uint8;
    }

    /**
     * Convert buffer to BigInt
     * @param input Buffer array
     * @returns {BigInt}
     */
    public static Uint8ToBigInt(input: Uint8Array): BigInt {
        return BigInt(Convert.uint8ToHex(input));
    }

    /**
     * Convert BigInt to UInt32 array (Little Endian)
     * @param input BigInt value
     * @returns {number[]}
     */
    public static BigIntToUInt64(input: BigInt): number[] {
        const uint8 = BigIntConvertUtil.BigIntToUint8(input);
        if (8 !== uint8.length) {
            throw Error(`byte array has unexpected size '${uint8.length}'`);
        }
        const view = new DataView(uint8.buffer);
        return [view.getUint32(4), view.getUint32(0)];
    }

    /**
     * Convert UInt64 to BigInt (Little Endian)
     * @param input UInt64 in Uint32 array
     * @returns {BigInt}
     */
    public static UInt64ToBigInt(input: number[]): BigInt {
        const uint32Array = new Uint32Array(input);
        const uint8 = new Uint8Array(uint32Array.buffer).reverse();
        return BigInt(Convert.uint8ToHex(uint8));

    }
}
