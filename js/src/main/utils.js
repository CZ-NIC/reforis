/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export function addWeightsToPages(pages) {
    const step = Math.floor(100 / pages.length);
    let i = 0;
    return pages.map((page) => {
        if (Object.prototype.hasOwnProperty.call(page, "pages")) page.pages = addWeightsToPages(page.pages);
        i++;
        return { ...page, weight: i * step };
    });
}

export function plug(pages, plugin) {
    const menuToPlug = getMenuToPlug(pages, plugin);
    if (Object.hasOwnProperty.call(plugin, "pages")) {
        plugin.pages = addWeightsToPages(plugin.pages);
    }
    menuToPlug.push(plugin);
    menuToPlug.sort((a, b) => a.weight - b.weight);
    return pages;
}

function getMenuToPlug(pages, plugin) {
    if (Object.hasOwnProperty.call(plugin, "pages")) {
        return pages;
    }
    if (Object.hasOwnProperty.call(plugin, "submenuId")) {
        return pages.find((item) => item.submenuId === plugin.submenuId).pages;
    }
    return pages;
}
