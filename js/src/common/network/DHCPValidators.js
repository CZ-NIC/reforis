/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import ipaddr from "ipaddr";

import { undefinedIfEmpty, withoutUndefinedKeys, validateIPv4Address } from "foris";

import { validateRequiredField } from "./validators";
import { addToAddress } from "./utils";

/*
 * Check if DHCP start address is within network.
 * - networkAddress - address object (parsed by ipaddr)
 * - prefixLength - network prefix related to mask (e.g. 24 for 255.255.255.0)
 * - DHCPStartAddress - address object (parsed by ipaddr)
 */
function isDHCPStartWithinNetwork(networkAddress, prefixLength, DHCPStartAddress) {
    // Check if DHCP start address is within network
    return DHCPStartAddress.match(networkAddress, prefixLength);
}

/*
 * Check if DHCP start address clashes with a reserved address.
 * - networkAddress - address object (parsed by ipaddr)
 * - broadcastAddress - address object (parsed by ipaddr)
 * - DHCPStartAddress - address object (parsed by ipaddr)
 */
function isDHCPStartReserved(networkAddress, broadcastAddress, DHCPStartAddress) {
    // Check if DHCP start address is not at the borders of address range
    if ([broadcastAddress.toString(), networkAddress.toString()]
        .includes(DHCPStartAddress.toString())
    ) {
        return true;
    }
    return false;
}

/*
 * Check if number of leases can be realized in this network.
 * - networkAddress - address object (parsed by ipaddr)
 * - prefixLength - address object (parsed by ipaddr)
 * - DHCPStart - address object (parsed by ipaddr)
 * - maxLeases - maximum number of addresses used by DHCP
 */
function isMaxLeasesValid(networkAddress, prefixLength, DHCPStart, maxLeases) {
    const maxAddress = addToAddress(DHCPStart, maxLeases - 1);
    return maxAddress.match(networkAddress, prefixLength);
}

function validatePositiveNumber(number) {
    // eslint-disable-next-line no-restricted-globals
    if (number === "" || isNaN(number)) {
        return _("Value must be a number.");
    } if (number < 1) {
        return _("Value must be positive.");
    }
    return undefined;
}

export default function validateDHCP(
    dhcpSettings, routerIPString, networkMask, isNetworkConfigBroken,
) {
    if (isNetworkConfigBroken) {
        return {
            start: _("Invalid network settings. DHCP settings can't be validated."),
        };
    }

    const errors = {
        start: (
            validateRequiredField(dhcpSettings.start)
            || validateIPv4Address(dhcpSettings.start)
        ),
        limit: validatePositiveNumber(dhcpSettings.limit),
        lease_time: dhcpSettings.lease_time < 1 ? _("Minimum lease time is 1 hour.") : undefined,
    };

    if (!errors.start) {
        const prefixLength = ipaddr.IPv4.parse(networkMask).prefixLengthFromSubnetMask();
        const CIDR = `${routerIPString}/${prefixLength}`;
        const networkAddress = ipaddr.IPv4.networkAddressFromCIDR(CIDR);
        const broadcastAddress = ipaddr.IPv4.broadcastAddressFromCIDR(CIDR);
        const DHCPStart = ipaddr.IPv4.parse(dhcpSettings.start);

        if (!isDHCPStartWithinNetwork(networkAddress, prefixLength, DHCPStart)) {
            errors.start = _("Address is outside current network.");
        } else if (isDHCPStartReserved(networkAddress, broadcastAddress, DHCPStart)) {
            errors.start = _("Address is already reserved for other purposes.");
        } else if (!errors.limit) { // There are no more important errors so far.
            if (!isMaxLeasesValid(networkAddress, prefixLength, DHCPStart, dhcpSettings.limit)) {
                errors.limit = _("Too many addresses requested. Set a lower number or change DHCP start.");
            } else if (DHCPStart.toString() === routerIPString && dhcpSettings.limit === 1) {
                errors.limit = _("The only DHCP lease is the same as router's address. Increase limit or change start address.");
            }
        }
    }

    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
