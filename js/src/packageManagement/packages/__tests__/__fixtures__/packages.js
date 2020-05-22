/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export default function packagesFixture(UpdatesEnabled = true) {
    return {
        enabled: UpdatesEnabled,
        package_lists:
            [
                {
                    enabled: false,
                    hidden: true,
                    description: "Hidden package description",
                    name: "hidden-package",
                    title: "Hidden package title",
                    labels: [],
                    options: [],
                },
                {
                    enabled: true,
                    hidden: false,
                    description: "Enabled package description",
                    name: "enabled-package",
                    title: "Enabled package title",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Support for additional protocols and connection types.",
                    name: "3g",
                    title: "Extensions of network protocols for 3G/LTE",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: true,
                    description: "Software for participation in data collection and dynamic distributed firewall.",
                    name: "datacollect",
                    title: "Data Collection",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Software for detecting new devices on local network (EXPERIMENTAL).",
                    name: "dev-detect",
                    title: "Device detection",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Software for sharing television received by a DVB tuner on Turris. Does not include device drivers.",
                    name: "dvb",
                    title: "DVB tuner",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Trap for password-guessing robots on SSH.",
                    name: "honeypot",
                    title: "SSH Honeypot",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Several addional tabs and controls for the advanced LuCI interface.",
                    name: "luci-controls",
                    title: "LuCI extensions",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Set of utilities to manage Linux Containers (lightweight virtualization technology).",
                    name: "lxc",
                    title: "LXC utilities",
                    options: [],
                    labels: [
                        {
                            description: "Using external storage is highly suggested for this package list usage. Software it contains can wear out flash storages as it performs increased amount of writes.",
                            name: "storage",
                            severity: "primary",
                            title: "External storage"
                        },
                        {
                            description: "Software in this package list consumes possibly higher amount of RAM to run. It is not suggested to use it with small memory.",
                            name: "high_memory",
                            severity: "info",
                            title: "High memory usage"
                        },
                        {
                            description: "This functionality is usable only for advanced users.",
                            name: "advanced",
                            severity: "secondary",
                            title: "Advanced users"
                        }
                    ],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Services allowing to connect a disk to the router and use it as network data store.",
                    name: "nas",
                    title: "NAS",
                    labels: [],
                    options: [{
                        description: "Implementation of SMB network protocol.",
                        enabled: true,
                        name: "samba",
                        title: "Samba",
                        labels: [],
                    }, {
                        description: "Digital media sharing server.",
                        enabled: false,
                        name: "dlna",
                        title: "DLNA",
                        labels: [],
                    }, {
                        description: "BitTorrent client.",
                        enabled: true,
                        name: "transmission",
                        title: "Transmission",
                        labels: [],
                    }, {
                        description: "Software RAID storage support using mdadm.",
                        enabled: false,
                        name: "raid",
                        title: "mdadm RAID",
                        labels: [
                            {
                                description: "This functionality is usable only for advanced users.",
                                name: "advanced",
                                severity: "secondary",
                                title: "Advanced users"
                            }
                        ],
                    }, {
                        description: "Add support to access encrypted storage devices using dm-crypt.",
                        enabled: false,
                        name: "encrypt",
                        title: "Encrypted Storage",
                        labels: [],
                    }],
                },
                {
                    enabled: false,
                    hidden: true,
                    description: "Server side for Turris MOX without SD card used as Wi-Fi access point.",
                    name: "netboot",
                    title: "Turris MOX network boot",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Actively measures speed of Internet connection using netmetr.cz service.",
                    name: "netmetr",
                    title: "Internet connection speed measurement",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "An easy setup of OpenVPN server from Foris.",
                    name: "openvpn",
                    title: "OpenVPN",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Software for in depth monitoring of your traffic.",
                    name: "pakon",
                    title: "Pakon",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Services allowing to connect a printer to the router and use it for remote printing.",
                    name: "printserver",
                    title: "Print server",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: true,
                    description: "Service for storing configuration backups on remote servers (EXPERIMENTAL).",
                    name: "ssbackup",
                    title: "Cloud Backups",
                    labels: [],
                    options: [],
                },
                {
                    enabled: false,
                    hidden: false,
                    description: "Service to increase anonymity on the Internet.",
                    name: "tor",
                    title: "Tor",
                    labels: [],
                    options: [],
                },
            ],
    };
}
