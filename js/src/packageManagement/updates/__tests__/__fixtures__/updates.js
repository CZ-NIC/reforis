/*
 * Copyright (c) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const exampleHash = "303808909";
export const exampleUpdate = {
    hash: exampleHash,
    approvable: true,
    plan: [
        {
            op: "install",
            name: "PACKAGE",
            cur_ver: "1.0",
            new_ver: "2.0",
        },
    ],
    time: "2020-02-20T12:02:35",
};

export const delay = 3;
