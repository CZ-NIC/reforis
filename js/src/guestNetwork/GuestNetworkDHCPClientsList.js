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

GuestNetworkDHCPClientsList.propTypes = {
    formData: PropTypes.shape({
        dhcp: PropTypes.shape({
            enabled: PropTypes.bool.isRequired,
            clients: PropTypes.arrayOf(PropTypes.object).isRequired,
        }).isRequired,
    }),
};

export default function GuestNetworkDHCPClientsList({ formData }) {
    if (!formData.enabled || !formData.dhcp.enabled) return null;

    const container = document.getElementById("dhcp_clients_container");
    return ReactDOM.createPortal(
        <DHCPClientsList clients={formData.dhcp.clients} />,
        container,
    );
}
