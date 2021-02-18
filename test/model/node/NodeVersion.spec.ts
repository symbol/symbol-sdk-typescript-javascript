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

import { expect } from 'chai';
import { NodeVersion } from '../../../src/model/node/NodeVersion';

describe('NodeVersion', () => {
    const validRawVersion1 = 4294967295;
    const validFormattedVersion1 = '255.255.255.255';
    const validRawVersion2 = 0;
    const validFormattedVersion2 = '0.0.0.0';
    const validRawVersion3 = 655367;
    const validFormattedVersion3 = '0.10.0.7';

    const invalidFormattedVersion1 = '0.0.0.0.0';
    const invalidFormattedVersion2 = '-1.0.0.0';
    const invalidFormattedVersion3 = '0.0.0.256';
    const invalidFormattedVersion4 = 'some text';
    const invalidFormattedVersion5 = '';

    const invalidRawVersion1 = -1231;
    const invalidRawVersion2 = 42949672955;
    const invalidRawVersion3 = 23.34;
    const invalidRawVersion4 = Infinity;

    it('createComplete a NodeVersion by given raw version', () => {
        const nodeVersion = NodeVersion.createFromRawNodeVersion(validRawVersion1);
        expect(nodeVersion.raw()).to.be.equal(validRawVersion1);
    });

    it('createComplete a NodeVersion by given raw version', () => {
        const nodeVersion = NodeVersion.createFromRawNodeVersion(validRawVersion2);
        expect(nodeVersion.raw()).to.be.equal(validRawVersion2);
    });

    it('createComplete a NodeVersion by given raw version', () => {
        const nodeVersion = NodeVersion.createFromRawNodeVersion(validRawVersion3);
        expect(nodeVersion.raw()).to.be.equal(validRawVersion3);
    });

    it('createComplete a NodeVersion by given formatted version', () => {
        const nodeVersion = NodeVersion.createFromFormattedNodeVersion(validFormattedVersion1);
        expect(nodeVersion.raw()).to.be.equal(validRawVersion1);
    });

    it('createComplete a NodeVersion by given formatted version', () => {
        const nodeVersion = NodeVersion.createFromFormattedNodeVersion(validFormattedVersion2);
        expect(nodeVersion.raw()).to.be.equal(validRawVersion2);
    });

    it('createComplete a NodeVersion by given formatted version', () => {
        const nodeVersion = NodeVersion.createFromFormattedNodeVersion(validFormattedVersion3);
        expect(nodeVersion.raw()).to.be.equal(validRawVersion3);
    });

    it('print formatted node version', () => {
        const nodeVersion = NodeVersion.createFromRawNodeVersion(validRawVersion1);
        expect(nodeVersion.formatted()).to.be.equal(validFormattedVersion1);
    });

    it('print formatted node version', () => {
        const nodeVersion = NodeVersion.createFromRawNodeVersion(validRawVersion2);
        expect(nodeVersion.formatted()).to.be.equal(validFormattedVersion2);
    });

    it('print formatted node version', () => {
        const nodeVersion = NodeVersion.createFromRawNodeVersion(validRawVersion3);
        expect(nodeVersion.formatted()).to.be.equal(validFormattedVersion3);
    });

    it('should throw Error when negative raw version provided', () => {
        expect(() => {
            NodeVersion.createFromRawNodeVersion(invalidRawVersion1);
        }).to.throw(`Invalid node version number '${invalidRawVersion1}'`);
    });

    it('should throw Error when too large raw version provided', () => {
        expect(() => {
            NodeVersion.createFromRawNodeVersion(invalidRawVersion2);
        }).to.throw(`Invalid node version number '${invalidRawVersion2}'`);
    });

    it('should throw Error when float number raw version provided', () => {
        expect(() => {
            NodeVersion.createFromRawNodeVersion(invalidRawVersion3);
        }).to.throw(`Invalid node version number '${invalidRawVersion3}'`);
    });

    it('should throw Error when Infinity number raw version provided', () => {
        expect(() => {
            NodeVersion.createFromRawNodeVersion(invalidRawVersion4);
        }).to.throw(`Invalid node version number '${invalidRawVersion4}'`);
    });

    it('should throw Error when invalid formatted version provided', () => {
        expect(() => {
            NodeVersion.createFromFormattedNodeVersion(invalidFormattedVersion1);
        }).to.throw(`Invalid node version string '${invalidFormattedVersion1}'`);
    });

    it('should throw Error when invalid formatted version with one negative provided', () => {
        expect(() => {
            NodeVersion.createFromFormattedNodeVersion(invalidFormattedVersion2);
        }).to.throw(`Invalid node version string '${invalidFormattedVersion2}'`);
    });

    it('should throw Error when invalid formatted version with one large provided', () => {
        expect(() => {
            NodeVersion.createFromFormattedNodeVersion(invalidFormattedVersion3);
        }).to.throw(`Invalid node version string '${invalidFormattedVersion3}'`);
    });

    it('should throw Error when invalid text string provided', () => {
        expect(() => {
            NodeVersion.createFromFormattedNodeVersion(invalidFormattedVersion4);
        }).to.throw(`Invalid node version string '${invalidFormattedVersion4}'`);
    });

    it('should throw Error when empty string provided', () => {
        expect(() => {
            NodeVersion.createFromFormattedNodeVersion(invalidFormattedVersion5);
        }).to.throw(`Invalid node version string '${invalidFormattedVersion5}'`);
    });

    it('should equal versions', () => {
        const version = NodeVersion.createFromRawNodeVersion(validRawVersion1);
        const compareVersion = NodeVersion.createFromRawNodeVersion(validRawVersion1);
        expect(version.equals(compareVersion)).to.be.equal(true);
    });

    it('should not equal versions', () => {
        const version = NodeVersion.createFromRawNodeVersion(validRawVersion1);
        const compareVersion = NodeVersion.createFromRawNodeVersion(validRawVersion2);
        expect(version.equals(compareVersion)).to.be.equal(false);
    });
});
