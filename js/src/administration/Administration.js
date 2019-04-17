/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import Password from './Password';
import RegionAndTime from './RegionAndTime';
import Reboot from './Reboot';

Administration.propTypes = {
    ws: propTypes.object.isRequired
};

export default function Administration({ws}) {
    return <>
        <Password ws={ws}/>
        <RegionAndTime ws={ws}/>
        <Reboot ws={ws}/>
    </>
}