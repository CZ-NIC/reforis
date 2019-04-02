/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const ERROR_MESSAGES = {
    ipAddress: _('This is not a valid IPv4 address.'),
    domain: _('This is not a valid domain name.')
};

export function validateIPAddress(ipAddress) {
    if (!ipAddress || ipAddress === '') return true;
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress);
}

export function validateDomain(domain) {
    if (!domain || domain === '') return true;
    return /^([a-zA-Z0-9-]{1,63}\.?)*$/.test(domain);
}