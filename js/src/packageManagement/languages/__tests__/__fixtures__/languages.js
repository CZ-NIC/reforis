/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export default function languagesFixture(UpdatesEnabled = true) {
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
            ]
    };
}
