/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState} from 'react';

import ForisForm from '../formContainer/ForisForm';
import {APIEndpoints} from '../common/API';
import InterfacesForm from './InterfacesForm';
import {OpenPortsModals, KeepPortsClosedConfirmModal} from './modals';

export const NETWORKS_CHOICES = {
    wan: _('WAN'),
    lan: _('LAN'),
    guest: _('Guest Network'),
    none: _('Unassigned'),
};

export const NETWORKS_TYPES = ['wan', 'lan', 'guest', 'none'];

export default function Interfaces() {
    const [openPortsModalShown, setOpenPortsModalShown] = useState(false);
    const [keepPortsClosedConfirmModalShown, setKeepPortsClosedConfirmShown] = useState(false);

    function onSubmit(formData, setFormValue, submit) {
        function setOpenPorts(value) {
            setFormValue(() => (
                {
                    firewall: {
                        $set: {
                            http_on_wan: value,
                            https_on_wan: value,
                            ssh_on_wan: value
                        }
                    }
                }
            ))({target: '', value: ''});
        }

        return e => {
            if (formData.networks.lan.length > 0) {
                submit(e);
                return
            }
            e.preventDefault();

            if (openPortsModalShown) {
                setOpenPorts(true);
                setOpenPortsModalShown(false);
                submit(e);
            } else if (keepPortsClosedConfirmModalShown) {
                setOpenPorts(false);
                setKeepPortsClosedConfirmShown(false);
                submit(e);
            } else
                setOpenPortsModalShown(true);

        }
    }

    function keepPortsClosedHandler(e) {
        e.preventDefault();
        setOpenPortsModalShown(false);
        setKeepPortsClosedConfirmShown(true);
    }

    return <ForisForm
        forisConfig={{
            endpoint: APIEndpoints.interfaces,
            wsModule: 'networks',
        }}
        prepDataToSubmit={prepDataToSubmit}
        onSubmitOverridden={onSubmit}
    >
        <OpenPortsModals
            shown={openPortsModalShown}
            setShown={setOpenPortsModalShown}
            onKeepPortsClosed={keepPortsClosedHandler}
        />
        <KeepPortsClosedConfirmModal
            shown={keepPortsClosedConfirmModalShown}
            setShown={setKeepPortsClosedConfirmShown}
        />
        <InterfacesForm/>
    </ForisForm>
}

function prepDataToSubmit(formData) {
    let res = {networks: {}, firewall: formData.firewall};
    for (let network of NETWORKS_TYPES)
        res.networks[network] = [];

    for (let network of NETWORKS_TYPES)
        formData.networks[network]
            .filter(i => i.configurable)
            .forEach(i => res.networks[network].push(i.id));

    return res
}
