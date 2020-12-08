/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import getPages from "../pages";
import { newSubmenu, pluginInExistedSubmenu } from "./__fixtures__/plugins";

describe("Test plugging in the menu.", () => {
    let deviceDetails = {};

    it("Master plugin first, slave second (normal order).", () => {
        global.ForisPlugins = [
            newSubmenu("nonexisted-submenu", 1),
            pluginInExistedSubmenu("nonexisted-submenu", 1),
        ];
        const pages = getPages(deviceDetails);

        expect(pages[4].submenuId).toBe("nonexisted-submenu");
        expect(pages[4].pages[0].name).toBe("Plugin in submenu");
    });

    it("Slave plugin first, master second (reversed order).", () => {
        global.ForisPlugins = [
            pluginInExistedSubmenu("nonexisted-submenu", 1),
            newSubmenu("nonexisted-submenu", 1),
        ];
        const pages = getPages(deviceDetails);
        expect(pages[4].submenuId).toBe("nonexisted-submenu");
        expect(pages[4].pages[0].name).toBe("Plugin in submenu");
    });
});
