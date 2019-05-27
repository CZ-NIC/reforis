/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


export function createPortalContainer(id) {
    let portalRoot = document.getElementById(id);
        if (!portalRoot) {
            portalRoot = document.createElement('div');
            portalRoot.setAttribute('id', id);
            document.body.appendChild(portalRoot)
        }
}
