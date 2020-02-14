/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { PAGES } from "./__fixtures__/pages";
import { newSubmenu, pluginInExistedSubmenu, pluginInRoot } from "./__fixtures__/plugins";

import { addWeightsToPages, plug } from "../utils";

describe("Test plugging in the menu.", () => {
    let pagesWithWeight;
    beforeEach(() => {
        pagesWithWeight = addWeightsToPages(PAGES);
    });

    it("Plug, weight=1.", () => {
        const plugin = pluginInRoot(1);
        const pages = plug(pagesWithWeight, plugin);
        expect(pages[0].name).toBe(plugin.name);
    });
    it("Plug, weight=50.", () => {
        const plugin = pluginInRoot(50);
        const pages = plug(pagesWithWeight, plugin);
        expect(pages[3].name).toBe(plugin.name);
        expect(pages[2].weight).toBeLessThan(50);
        expect(pages[4].weight).toBeGreaterThan(50);
    });

    it("Plug into existed submenu, start.", () => {
        const plugin = pluginInExistedSubmenu("first-submenu", 1);
        const pages = plug(pagesWithWeight, plugin);
        expect(pages[3].pages[0].name).toBe(plugin.name);
    });
    it("Plug into existed submenu, end.", () => {
        const plugin = pluginInExistedSubmenu("first-submenu", 100);
        const { pages } = plug(pagesWithWeight, plugin)[3];
        expect(pages[pages.length - 1].name).toBe(plugin.name);
    });

    it("Plug into new submenu.", () => {
        const submenu = newSubmenu("new-submenu", 1);
        const pages = plug(pagesWithWeight, submenu);
        expect(pages[0].name).toBe(submenu.name);
        expect(pages[0].id).toBe(submenu.id);
        expect(pages[0].pages.length).toBe(2);
    });
});
