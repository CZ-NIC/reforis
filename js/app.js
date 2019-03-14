/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-dom';
import Wifi from './wifi/Wifi';

window.addEventListener('load', () => {
    let domContainer = document.getElementById('wifi_form_container');
    render(<Wifi/>, domContainer);
}, false);

