/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { Select } from "foris";
import {
    BUSES, INTERFACE_STATES, INTERFACE_TYPES, NETWORKS_CHOICES,
} from "./constants";

SelectedInterface.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.keys(INTERFACE_TYPES)).isRequired,
    state: PropTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
    bus: PropTypes.oneOf(BUSES).isRequired,
    slot: PropTypes.string.isRequired,
    module_id: PropTypes.number.isRequired,
    link_speed: PropTypes.number.isRequired,
    network: PropTypes.oneOf(["wan", "lan", "guest", "none"]).isRequired,
    configurable: PropTypes.bool.isRequired,
    WANIsEmpty: PropTypes.bool.isRequired,
    hideUnassigned: PropTypes.bool,
    onNetworkChange: PropTypes.func.isRequired,
};

SelectedInterface.defaultProps = {
    hideUnassigned: false,
};

export default function SelectedInterface({
    id,
    type,
    state,
    bus,
    slot,
    module_id,
    link_speed,
    network,
    configurable,

    WANIsEmpty,
    hideUnassigned,
    onNetworkChange,
}) {
    const myRef = useRef(null);
    useEffect(() => {
        myRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }, [id]);

    const networkChoices = { ...NETWORKS_CHOICES };
    /*
    Prevent adding more than 1 inteface to WAN group.
    Don't remove option if interface it's already in WAN as it breaks UX.
    */
    if (!WANIsEmpty && network !== "wan") delete networkChoices.wan;
    // Prevent setting "Unassigned" network
    if (hideUnassigned) delete networkChoices.none;

    return (
        <>
            <h1>{slot}</h1>
            <Select
                choices={networkChoices}
                label={_("Network")}
                value={network}
                disabled={!configurable}

                onChange={onNetworkChange}
            />
            <table ref={myRef} className="table table-hover">
                <tbody>
                    <tr>
                        <th>{_("Type")}</th>
                        <td>{type}</td>
                    </tr>
                    <tr>
                        <th>{_("State")}</th>
                        <td>{state}</td>
                    </tr>
                    <tr>
                        <th>{_("Bus")}</th>
                        <td>{bus}</td>
                    </tr>
                    <tr>
                        <th>{_("Slot")}</th>
                        <td>{slot}</td>
                    </tr>
                    <tr>
                        <th>{_("Module ID")}</th>
                        <td>{module_id}</td>
                    </tr>
                    <tr>
                        <th>{_("Link speed")}</th>
                        <td>{link_speed}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
