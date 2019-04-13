/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export default function mockFetch(data) {
    return jest.fn(() =>
        new Promise((resolve, reject) => {
            resolve({
                ok: true,
                json: () => {
                    return data ? data : {};
                },
            });
        })
    );
}
