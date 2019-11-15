/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const NETWORKS_CHOICES = {
    wan: _("WAN"),
    lan: _("LAN"),
    guest: _("Guest Network"),
    none: _("Unassigned"),
};
export const NETWORKS_TYPES = ["wan", "lan", "guest", "none"];

export const BUSES = ["eth", "pci", "usb", "sdio", "sfp"];
export const INTERFACE_TYPES = {
    eth: "eth",
    wifi: "wifi",
    wwan: "wwan",
};
export const INTERFACE_STATES = {
    up: "up",
    down: "down",
};
