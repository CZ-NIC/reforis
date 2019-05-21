/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState} from 'react';

import {NETWORKS_CHOICES, NETWORKS_TYPES} from './Interfaces';
import Network from './Network';
import SelectedInterface from './SelectedInterface';

export default function InterfacesForm({formData, formErrors, setFormValue, ...props}) {
    const [selectedID, setSelectedID] = useState(null);

    function getInterfaceById(id) {
        if (!selectedID)
            return [null, null, null];

        for (let network of NETWORKS_TYPES) {
            const interfaceIdx = formData.networks[network].findIndex(i => i.id === id);
            if (interfaceIdx !== -1) return [formData.networks[network][interfaceIdx], network, interfaceIdx];
        }
    }

    const [selectedInterface, selectedInterfaceNetwork, selectedInterfaceIdx] = getInterfaceById(selectedID);

    function handleNetworkChange(e) {
        setFormValue(
            value => ({
                networks: {
                    [value]: {$push: [selectedInterface,]},
                    [selectedInterfaceNetwork]: {$splice: [[selectedInterfaceIdx, 1]]},
                },
            })
        )(e)
    }

    return <>
        <h3>{NETWORKS_CHOICES.wan}</h3>
        <Network interfaces={formData.networks.wan} selected={selectedID} setSelected={setSelectedID} {...props}/>
        <h3>{NETWORKS_CHOICES.lan}</h3>
        <Network interfaces={formData.networks.lan} selected={selectedID} setSelected={setSelectedID} {...props}/>
        <h3>{NETWORKS_CHOICES.guest}</h3>
        <Network interfaces={formData.networks.guest} selected={selectedID} setSelected={setSelectedID} {...props}/>
        <h3>{NETWORKS_CHOICES.none}</h3>
        <Network interfaces={formData.networks.none} selected={selectedID} setSelected={setSelectedID} {...props}/>
        {selectedID ?
            <SelectedInterface
                network={selectedInterfaceNetwork}
                WANIsEmpty={formData.networks.wan.length === 0}
                {...selectedInterface}

                onNetworkChange={handleNetworkChange}
            />
            : null}
    </>
}
