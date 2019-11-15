/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const HTMODES = {
    NOHT: _("Disabled"),
    HT20: _("802.11n - 20 MHz wide channel"),
    HT40: _("802.11n - 40 MHz wide channel"),
    VHT20: _("802.11ac - 20 MHz wide channel"),
    VHT40: _("802.11ac - 40 MHz wide channel"),
    VHT80: _("802.11ac - 80 MHz wide channel"),
};
export const HWMODES = {
    "11g": "2.4",
    "11a": "5",
};
export const HELP_TEXTS = {
    password: _(`
        WPA2 pre-shared key, that is required to connect to the network.
    `),
    hidden: _("If set, network is not visible when scanning for available networks."),
    hwmode: _(`
        The 2.4 GHz band is more widely supported by clients, but tends to have more interference. The 5 GHz band is a
        newer standard and may not be supported by all your devices. It usually has less interference, but the signal
        does not carry so well indoors.`),
    htmode: _(`
        Change this to adjust 802.11n/ac mode of operation. 802.11n with 40 MHz wide channels can yield higher
        throughput but can cause more interference in the network. If you don't know what to choose, use the default
        option with 20 MHz wide channel.
    `),
    guest_wifi_enabled: _(`
        Enables Wi-Fi for guests, which is separated from LAN network. Devices connected to this network are allowed to
        access the internet, but aren't allowed to access other devices and the configuration interface of the router.
        Parameters of the guest network can be set in the Guest network tab.
        `),
};
