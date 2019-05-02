/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {
    validateDomain,
    validateDUID,
    validateIPv4Address,
    validateIPv6Address,
    validateIPv6Prefix, validateMAC
} from '../../common/validations';

describe('Validation functions', () => {
    it('validateIPv4Address valid', () => {
        expect(validateIPv4Address('192.168.1.1')).toBe(undefined);
        expect(validateIPv4Address('1.1.1.1')).toBe(undefined);
        expect(validateIPv4Address('0.0.0.0')).toBe(undefined);
    });
    it('validateIPv4Address invalid', () => {
        expect(validateIPv4Address('invalid')).not.toBe(undefined);
        expect(validateIPv4Address('192.256.1.1')).not.toBe(undefined);
        expect(validateIPv4Address('192.168.256.1')).not.toBe(undefined);
        expect(validateIPv4Address('192.168.1.256')).not.toBe(undefined);
        expect(validateIPv4Address('192.168.1.256')).not.toBe(undefined);
    });

    it('validateIPv6Address valid', () => {
        expect(validateIPv6Address('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(undefined);
        expect(validateIPv6Address('0:0:0:0:0:0:0:1')).toBe(undefined);
        expect(validateIPv6Address('::1')).toBe(undefined);
        expect(validateIPv6Address('::')).toBe(undefined);

    });
    it('validateIPv6Address invalid', () => {
        expect(validateIPv6Address('invalid')).not.toBe(undefined);
        expect(validateIPv6Address('1.1.1.1')).not.toBe(undefined);
        expect(validateIPv6Address('1200::AB00:1234::2552:7777:1313')).not.toBe(undefined);
        expect(validateIPv6Address('1200:0000:AB00:1234:O000:2552:7777:1313')).not.toBe(undefined);
    });

    it('validateIPv6Prefix valid', () => {
        expect(validateIPv6Prefix('2002:0000::/16')).toBe(undefined);
        expect(validateIPv6Prefix('0::/0')).toBe(undefined);
    });
    it('validateIPv6Prefix invalid', () => {
        expect(validateIPv6Prefix('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).not.toBe(undefined);
        expect(validateIPv6Prefix('::1')).not.toBe(undefined);
        expect(validateIPv6Prefix('2002:0000::/999')).not.toBe(undefined);
    });


    it('validateDomain valid', () => {
        expect(validateDomain('example.com')).toBe(undefined);
        expect(validateDomain('one.two.three')).toBe(undefined);
    });
    it('validateDomain invalid', () => {
        expect(validateDomain('test/')).not.toBe(undefined);
        expect(validateDomain('.')).not.toBe(undefined);
    });

    it('validateDUID valid', () => {
        expect(validateDUID('abcdefAB')).toBe(undefined);
        expect(validateDUID('ABCDEF12')).toBe(undefined);
        expect(validateDUID('ABCDEF12AB')).toBe(undefined);

    });
    it('validateDUID invalid', () => {
        expect(validateDUID('gggggggg')).not.toBe(undefined);
        expect(validateDUID('abcdefABa')).not.toBe(undefined);
    });

    it('validateMAC valid', () => {
        expect(validateMAC('00:D0:56:F2:B5:12')).toBe(undefined);
        expect(validateMAC('00:26:DD:14:C4:EE')).toBe(undefined);
        expect(validateMAC('06:00:00:00:00:00')).toBe(undefined);
    });
    it('validateMAC invalid', () => {
        expect(validateMAC('00:00:00:00:00:0G')).not.toBe(undefined);
        expect(validateMAC('06:00:00:00:00:00:00')).not.toBe(undefined);
    });
});
