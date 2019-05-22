/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export function interfacesFixture(portsOpen = false) {
    return {
        firewall: {
            http_on_wan: portsOpen,
            https_on_wan: portsOpen,
            ssh_on_wan: portsOpen
        }
        ,
        networks: {
            guest:
                [
                    {
                        bus: "eth",
                        configurable: true,
                        id: "lan1",
                        link_speed: 0,
                        module_id: 0,
                        slot: "LAN1",
                        state: "down",
                        type: "eth"
                    },
                    {
                        bus: "eth",
                        configurable: true,
                        id: "lan4",
                        link_speed: 0,
                        module_id: 0,
                        slot: "LAN4",
                        state: "down",
                        type: "eth"
                    }
                ],
            lan:
                [
                    {
                        bus: "eth",
                        configurable: true,
                        id: "lan3",
                        link_speed: 0,
                        module_id: 0,
                        slot: "LAN3",
                        state: "down",
                        type: "eth"
                    }
                ],
            none:
                [
                    {
                        bus: "eth",
                        configurable: true,
                        id: "lan0",
                        link_speed: 0,
                        module_id: 0,
                        slot: "LAN0",
                        state: "down",
                        type: "eth"
                    },
                    {
                        bus: "eth",
                        configurable: true,
                        id: "lan2",
                        link_speed: 0,
                        module_id: 0,
                        slot: "LAN2",
                        state: "down",
                        type: "eth"
                    },
                    {
                        bus: "pci",
                        configurable: false,
                        id: "wlan1",
                        link_speed: 0,
                        module_id: 0,
                        slot: "1",
                        ssid: "",
                        state: "down",
                        type: "wifi"
                    }
                ],
            wan:
                [
                    {
                        bus: "eth",
                        configurable: true,
                        id: "eth2",
                        link_speed: 1000,
                        module_id: 0,
                        slot: "WAN",
                        state: "up",
                        type: "eth"
                    }
                ]
        }
    }
}
