/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-dom';

import WebSockets from './common/WebSockets';

import Main from './main/Main';
import Guide from './guide/Guide';

const ws = new WebSockets();

window.addEventListener('load', () => {
    const mainContainer = document.getElementById('app_container');
    if (mainContainer)
        render(<Main ws={ws}/>, mainContainer);

    const guideContainer = document.getElementById('guide_container');
    if (guideContainer)
        render(<Guide ws={ws}/>, guideContainer);

}, false);
