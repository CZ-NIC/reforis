/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export default function packagesFixture(UpdatesEnabled = true) {
    return {
        enabled: UpdatesEnabled,
        languages:
            [
                {
                    code: "cs",
                    enabled: true
                },
                {
                    code: "da",
                    enabled: false
                },
                {
                    code: "de",
                    enabled: false
                },
                {
                    code: "fr",
                    enabled: false
                },
                {
                    code: "lt",
                    enabled: false
                },
                {
                    code: "pl",
                    enabled: false
                },
                {
                    code: "ru",
                    enabled: false
                },
                {
                    code: "sk",
                    enabled: false
                },
                {
                    code: "hu",
                    enabled: false
                },
                {
                    code: "it",
                    enabled: false
                },
                {
                    code: "nb",
                    enabled: false
                }
            ],
        user_lists:
            [
                {
                    enabled: false,
                    hidden: true,
                    msg: "Hidden package msg",
                    name: "hidden-package",
                    title: "Hidden package title"
                },
                {
                    enabled: true,
                    hidden: false,
                    msg: "Enabled package msg",
                    name: "enabled-package",
                    title: "Enabled package title"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Support for additional protocols and connection types.",
                    name: "3g",
                    title: "Extensions of network protocols for 3G/LTE"
                },
                {
                    enabled: false,
                    hidden: true,
                    msg: "Software for participation in data collection and dynamic distributed firewall.",
                    name: "datacollect",
                    title: "Data Collection"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Software for detecting new devices on local network (EXPERIMENTAL).",
                    name: "dev-detect",
                    title: "Device detection"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Software for sharing television received by a DVB tuner on Turris. Does not include device drivers.",
                    name: "dvb",
                    title: "DVB tuner"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Trap for password-guessing robots on SSH.",
                    name: "honeypot",
                    title: "SSH Honeypot"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Several addional tabs and controls for the advanced LuCI interface.",
                    name: "luci-controls",
                    title: "LuCI extensions"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Set of utilities to manage Linux Containers (lightweight virtualization technology).",
                    name: "lxc",
                    title: "LXC utilities"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Services allowing to connect a disk to the router and use it as network data store.",
                    name: "nas",
                    title: "NAS"
                },
                {
                    enabled: false,
                    hidden: true,
                    msg: "Server side for Turris MOX without SD card used as Wi-Fi access point.",
                    name: "netboot",
                    title: "Turris MOX network boot"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Actively measures speed of Internet connection using netmetr.cz service.",
                    name: "netmetr",
                    title: "Internet connection speed measurement"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "An easy setup of OpenVPN server from Foris.",
                    name: "openvpn",
                    title: "OpenVPN"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Software for in depth monitoring of your traffic.",
                    name: "pakon",
                    title: "Pakon"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Services allowing to connect a printer to the router and use it for remote printing.",
                    name: "printserver",
                    title: "Print server"
                },
                {
                    enabled: false,
                    hidden: true,
                    msg: "Service for storing configuration backups on remote servers (EXPERIMENTAL).",
                    name: "ssbackup",
                    title: "Cloud Backups"
                },
                {
                    enabled: false,
                    hidden: false,
                    msg: "Service to increase anonymity on the Internet.",
                    name: "tor",
                    title: "Tor"
                }
            ]
    }
}

