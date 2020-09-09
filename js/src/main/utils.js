/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const addWeightsToPages = (pages) => {
    const step = Math.floor(100 / pages.length);
    let i = 0;
    return pages.map((page) => {
        if (Object.hasOwnProperty.call(page, "pages"))
            page.pages = addWeightsToPages(page.pages);
        i++;
        return { ...page, weight: i * step };
    });
};

export const insert = (pages, startIndex, plugins) => {
    plugins.map((plugin) => {
        // Handle plugins inside submenu
        if (
            !Object.hasOwnProperty.call(plugin, "pages") &&
            Object.hasOwnProperty.call(plugin, "submenuId")
        ) {
            plugins
                .filter(
                    (item) =>
                        item.submenuId === plugin.submenuId &&
                        Object.hasOwnProperty.call(item, "pages")
                )
                .map((element) =>
                    plugin.weight > 50
                        ? element.pages.push(plugin)
                        : element.pages.unshift(plugin)
                );
        }
        // Handle plugins itself
        if (Object.hasOwnProperty.call(plugin, "submenuId")) {
            pages
                .filter((item) => item.submenuId === plugin.submenuId)
                .map((page) =>
                    plugin.weight > 50
                        ? page.pages.push(plugin)
                        : page.pages.unshift(plugin)
                );
        }
        return null;
    });
    return [
        ...pages.slice(0, startIndex),
        ...plugins
            .sort((a, b) => a.name.length - b.name.length)
            .filter((item) => Object.hasOwnProperty.call(item, "icon")),
        ...pages.slice(startIndex),
    ];
};
