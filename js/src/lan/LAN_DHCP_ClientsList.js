/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';
import ReactDOM from 'react-dom';

import DHCPClientsList from '../common/network/DHCPClientsList';
import {LAN_MODES} from './LANForm';

LAN_DHCP_ClientsList.propTypes = {
    formData: propTypes.shape({
        mode: propTypes.oneOf(Object.keys(LAN_MODES)),
        mode_managed: propTypes.shape({
            dhcp: propTypes.shape({
                enabled: propTypes.bool.isRequired,
                clients: propTypes.arrayOf(propTypes.object).isRequired,
            }).isRequired
        })
    })
};

export default function LAN_DHCP_ClientsList({formData}) {
    if (formData.mode !== LAN_MODES.managed || !formData.mode_managed.dhcp.enabled)
        return null;

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    const container = document.createElement('div');
    const lanContainer = document.getElementById('lan_container');
    insertAfter(container, lanContainer);

    return ReactDOM.createPortal(
        <DHCPClientsList clients={formData.mode_managed.dhcp.clients}/>,
        container,
    )
}
