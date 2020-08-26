/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { PAGES } from "./__fixtures__/pages";
import {
    newSubmenu,
    pluginInRootWithoutIcon,
    pluginInExistedSubmenu,
    pluginInRoot,
} from "./__fixtures__/plugins";

import { addWeightsToPages, insert } from "../utils";

describe("Test plugging in the menu.", () => {
    let itemsWithWeight;
    beforeEach(() => {
        global.ForisPlugins = [];
    });

    it("Put and display plugin in root between 4 & 5.", () => {
        const plugin = pluginInRoot();
        ForisPlugins.push(plugin);
        itemsWithWeight = addWeightsToPages(insert(PAGES, 4, ForisPlugins));
        expect(itemsWithWeight[4].name).toBe(plugin.name);
    });

    it("Do not display plugin in root without icon.", () => {
        const plugin = pluginInRootWithoutIcon();
        ForisPlugins.push(plugin);
        itemsWithWeight = addWeightsToPages(insert(PAGES, 4, ForisPlugins));
        expect(itemsWithWeight[4].name).not.toBe(plugin.name);
    });

    it("Put plugin into existed submenu to the start.", () => {
        const plugin = pluginInExistedSubmenu("first-submenu", 1);
        ForisPlugins.push(plugin);
        itemsWithWeight = addWeightsToPages(insert(PAGES, 4, ForisPlugins));
        expect(itemsWithWeight[3].pages[0].name).toBe(plugin.name);
    });

    it("Put plugin into existed submenu to the end.", () => {
        const plugin = pluginInExistedSubmenu("first-submenu", 100);
        ForisPlugins.push(plugin);
        itemsWithWeight = addWeightsToPages(insert(PAGES, 4, ForisPlugins));
        expect(itemsWithWeight[3].pages[4].name).toBe(plugin.name);
    });

    it("Put new submenu after plugins.", () => {
        const submenu = newSubmenu("new-submenu", 1);
        ForisPlugins.push(submenu);
        itemsWithWeight = addWeightsToPages(insert(PAGES, 5, ForisPlugins));
        expect(itemsWithWeight[5].name).toBe(submenu.name);
        expect(itemsWithWeight[5].id).toBe(submenu.id);
        expect(itemsWithWeight[5].pages.length).toBe(2);
    });
});
