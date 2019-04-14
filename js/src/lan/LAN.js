/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import ForisForm from '../forisForm/ForisForm';
import {validateManaged} from './LANManagedForm';
import {validateUnmanaged} from './LANUnmanagedForm';
import LANForm, {LAN_MODES} from './LANForm';

LAN.propTypes = {
    ws: propTypes.object.isRequired
};

export default function LAN({ws}) {
    return <ForisForm
        ws={ws}
        module='lan'
        prepData={data => data}
        prepDataToSubmit={prepDataToSubmit}
        validator={validator}
    >
        <LANForm/>
    </ForisForm>
}

function prepDataToSubmit(formData) {
    delete formData.interface_count;
    delete formData.interface_up_count;

    if (formData.mode === LAN_MODES.managed) {
        delete formData.mode_unmanaged;
        delete formData.mode_managed.dhcp.clients;
        if (!formData.mode_managed.dhcp.enabled)
            formData.mode_managed.dhcp = {enabled: false}
    } else if (formData.mode === LAN_MODES.unmanaged) {
        delete formData.mode_managed;
        const lanType = formData.mode_unmanaged.lan_type;
        formData.mode_unmanaged = {
            lan_type: lanType,
            [`lan_${lanType}`]: formData.mode_unmanaged[`lan_${lanType}`]
        }
    }

    return formData
}

function validator(formData) {
    let errors = {};
    if (formData.mode === LAN_MODES.managed)
        errors.mode_managed = validateManaged(formData.mode_managed);
    else if (formData.mode === LAN_MODES.unmanaged)
        errors.mode_unmanaged = validateUnmanaged(formData.mode_unmanaged);

    return errors[`mode_${formData.mode}`] ? errors : null;
}
