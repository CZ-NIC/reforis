/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import ipaddr from "ipaddr";

/*
 * Add a number of addresses to start one.
 * - start - address object (parsed by ipaddr)
 * - increment - number of addresses to add
 */
export function addToAddress(start, increment) {
    const octets = start.toByteArray();
    let remainder = increment;
    // Increase value of octets - in backwards order
    for (let i = 3; i > 0; i--) {
        const increasedValue = octets[i] + remainder;
        if (increasedValue > 255) {
            octets[i] = increasedValue % 256;
            // Value for next octets
            remainder = Math.floor(increasedValue / 256);
        } else {
            octets[i] += remainder;
            remainder = 0;
        }
    }
    return ipaddr.fromByteArray(octets);
}

/*
 * Return first address allocated by DHCP (as an object).
 * - routerIPString - address as a string
 * - DHCPStart - last octet (if less than 256) or number of addresses away from routerIP
 */
export function getDHCPStart(routerIPString, DHCPStart) {
    const routerIP = ipaddr.parse(routerIPString);
    let DHCPStartAddress;
    if (DHCPStart > 255) {
        DHCPStartAddress = addToAddress(routerIP, DHCPStart - 1);
    } else {
        // Make a copy of router's IP address and change last octet
        DHCPStartAddress = ipaddr.parse(routerIP.toString());
        DHCPStartAddress.octets[3] = DHCPStart;
    }
    return DHCPStartAddress;
}
