/*
 * Copyright 2021 NEM
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

export class NodeVersion {
    /**
     * Create a NodeVersion from a given raw version number.
     * @param {number} rawNodeVersion - Node version in number format.
     *                  ex: 655367
     * @returns {NodeVersion}
     */
    public static createFromRawNodeVersion(rawNodeVersion: number): NodeVersion {
        if (!NodeVersion.isValidRawNodeVersion(rawNodeVersion)) {
            throw new Error(`Invalid node version number '${rawNodeVersion}'`);
        }

        return new NodeVersion(rawNodeVersion);
    }

    /**
     * Create a NodeVersion from a given formatted version string.
     * @param {string} formattedNodeVersion - Node version in string format.
     *                  ex: 0.10.0.7
     * @returns {NodeVersion}
     */
    public static createFromFormattedNodeVersion(formattedNodeVersion: string): NodeVersion {
        if (!NodeVersion.isValidFormattedNodeVersion(formattedNodeVersion)) {
            throw new Error(`Invalid node version string '${formattedNodeVersion}'`);
        }

        const placeholderHex = '00';
        const hexVersionNumber = formattedNodeVersion
            .split('.')
            .map((value) => (placeholderHex + parseInt(value).toString(16)).slice(-2))
            .join('');

        const rawVersionNumber = parseInt(hexVersionNumber, 16);
        return new NodeVersion(rawVersionNumber);
    }

    /**
     * Determines the validity of a raw node version number.
     * @param {string} rawNodeVersion The raw node version number. Expected format 655367
     * @returns {boolean} true if the raw node version number is valid, false otherwise.
     */
    public static isValidRawNodeVersion = (rawNodeVersion: number): boolean => {
        const maxRawNodeVersion = 4294967295;
        const minRawNodeVersion = 0;

        return Number.isInteger(rawNodeVersion) && rawNodeVersion >= minRawNodeVersion && rawNodeVersion <= maxRawNodeVersion;
    };

    /**
     * Determines the validity of a formatted node version string.
     * @param {string} formattedNodeVersion The formatted node version string. Expected format: 0.10.0.7
     * @returns {boolean} true if the formatted node version string is valid, false otherwise.
     */
    public static isValidFormattedNodeVersion = (formattedNodeVersion: string): boolean => {
        const maxFormattedNodeVersionChunkValue = 255;
        const minFormattedNodeVersionChunkValue = 0;

        const versionChuncks = formattedNodeVersion.split('.').map((value) => parseInt(value));

        if (versionChuncks.length !== 4) {
            return false;
        }

        const isVersionChuncksValid = !versionChuncks.find(
            (value) => isNaN(value) || value < minFormattedNodeVersionChunkValue || value > maxFormattedNodeVersionChunkValue,
        );

        return isVersionChuncksValid;
    };

    /**
     * @internal
     * @param nodeVersion
     */
    private constructor(
        /**
         * The raw node version value.
         */
        private readonly nodeVersion: number,
    ) {}

    /**
     * Get node version in formatted format ex: 0.10.0.7
     * @returns {string}
     */
    public formatted(): string {
        const placeholderHex = '00000000';
        const hexNodeVersion = (placeholderHex + this.nodeVersion.toString(16)).slice(-8);
        const formattedNodeVersion = hexNodeVersion
            .match(/.{1,2}/g)!
            .map((hex) => parseInt(hex, 16))
            .join('.');

        return formattedNodeVersion;
    }

    /**
     * Get node version in the raw numeric format ex: 655367.
     * @returns {number}
     */
    public raw(): number {
        return this.nodeVersion;
    }

    /**
     * Compares node versions for equality
     * @param nodeVersion - Node version to compare
     * @returns {boolean}
     */
    public equals(nodeVersion: any): boolean {
        if (nodeVersion instanceof NodeVersion) {
            return this.nodeVersion === nodeVersion.raw();
        }

        return false;
    }
}
