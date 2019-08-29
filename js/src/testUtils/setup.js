/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import mockAxios from "jest-mock-axios";
import moment from "moment-timezone";

// Setup axios cleanup
global.afterEach(() => {
    mockAxios.reset();
});

jest.doMock('moment', () => {
    moment.tz.setDefault('UTC');
    return moment;
});

jest.doMock("utils/vfs_fonts", () => ({}));

window.WebSocket = jest.fn();
