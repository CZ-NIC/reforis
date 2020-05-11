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
                    enabled: true,
                },
                {
                    code: "da",
                    enabled: false,
                },
                {
                    code: "de",
                    enabled: false,
                },
                {
                    code: "fr",
                    enabled: false,
                },
                {
                    code: "lt",
                    enabled: false,
                },
                {
                    code: "pl",
                    enabled: false,
                },
                {
                    code: "ru",
                    enabled: false,
                },
                {
                    code: "sk",
                    enabled: false,
                },
                {
                    code: "hu",
                    enabled: false,
                },
                {
                    code: "it",
                    enabled: false,
                },
                {
                    code: "nb",
                    enabled: false,
                },
            ],
        package_lists:
            [
                {
                    enabled: false,
                    hidden: true,
                    description: "Hidden package description",
                    name: "hidden-package",
                    title: "Hidden package title",
                    options: [],
                },
                {
                    enabled: true,
                    hidden: false,
                    description: "Enabled package description",
                    name: "enabled-package",
                    title: "Enabled package title",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Support for additional protocols and connection types.",
                    name: "3g",
                    title: "Extensions of network protocols for 3G/LTE",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: true,
                    description: "Software for participation in data collection and dynamic distributed firewall.",
                    name: "datacollect",
                    title: "Data Collection",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Software for detecting new devices on local network (EXPERIMENTAL).",
                    name: "dev-detect",
                    title: "Device detection",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Software for sharing television received by a DVB tuner on Turris. Does not include device drivers.",
                    name: "dvb",
                    title: "DVB tuner",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Trap for password-guessing robots on SSH.",
                    name: "honeypot",
                    title: "SSH Honeypot",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Several addional tabs and controls for the advanced LuCI interface.",
                    name: "luci-controls",
                    title: "LuCI extensions",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Set of utilities to manage Linux Containers (lightweight virtualization technology).",
                    name: "lxc",
                    title: "LXC utilities",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Services allowing to connect a disk to the router and use it as network data store.",
                    name: "nas",
                    title: "NAS",
                    options: [{
                        "description": "Implementation of SMB network protocol.",
                        "enabled": true,
                        "name": "samba",
                        "title": "Samba"
                    }, {
                        "description": "Digital media sharing server.",
                        "enabled": false,
                        "name": "dlna",
                        "title": "DLNA"
                    }, {
                        "description": "BitTorrent client.",
                        "enabled": true,
                        "name": "transmission",
                        "title": "Transmission"
                    }, {
                        "description": "Software RAID storage support using mdadm.",
                        "enabled": false,
                        "name": "raid",
                        "title": "mdadm RAID"
                    }, {
                        "description": "Add support to access encrypted storage devices using dm-crypt.",
                        "enabled": false,
                        "name": "encrypt",
                        "title": "Encrypted Storage"
                    }],
                },
                {
                    enabled: false,
                    hidden: true,
                    description: "Server side for Turris MOX without SD card used as Wi-Fi access point.",
                    name: "netboot",
                    title: "Turris MOX network boot",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Actively measures speed of Internet connection using netmetr.cz service.",
                    name: "netmetr",
                    title: "Internet connection speed measurement",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "An easy setup of OpenVPN server from Foris.",
                    name: "openvpn",
                    title: "OpenVPN",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Software for in depth monitoring of your traffic.",
                    name: "pakon",
                    title: "Pakon",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Services allowing to connect a printer to the router and use it for remote printing.",
                    name: "printserver",
                    title: "Print server",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: true,
                    description: "Service for storing configuration backups on remote servers (EXPERIMENTAL).",
                    name: "ssbackup",
                    title: "Cloud Backups",
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Service to increase anonymity on the Internet.",
                    name: "tor",
                    title: "Tor",
                    options: [],
                },
            ],
    };
}
