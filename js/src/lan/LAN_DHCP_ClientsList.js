/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import DHCPClientsList from "common/network/DHCPClientsList";
import { LAN_MODES } from "./LANForm";

LAN_DHCP_ClientsList.propTypes = {
    formData: PropTypes.shape({
        mode: PropTypes.oneOf(Object.keys(LAN_MODES)),
        mode_managed: PropTypes.shape({
            dhcp: PropTypes.shape({
                enabled: PropTypes.bool.isRequired,
                clients: PropTypes.arrayOf(PropTypes.object).isRequired,
            }).isRequired,
        }),
    }),
};

export default function LAN_DHCP_ClientsList({ formData }) {
    if (
        formData.mode !== LAN_MODES.managed ||
        !formData.mode_managed.dhcp.enabled
    )
        return null;

    const lanContainer = document.getElementById("dhcp-clients-container");

    return ReactDOM.createPortal(
        <DHCPClientsList clients={formData.mode_managed.dhcp.clients} />,
        lanContainer
    );
}
