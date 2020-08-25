/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useAlert } from "foris";

import Network from "./Network";
import SelectedInterface from "./SelectedInterface";
import { NETWORKS_CHOICES, NETWORKS_TYPES } from "./constants";

InterfacesForm.propTypes = {
    formData: PropTypes.shape({
        networks: PropTypes.shape({
            guest: PropTypes.arrayOf(PropTypes.object).isRequired,
            lan: PropTypes.arrayOf(PropTypes.object).isRequired,
            none: PropTypes.arrayOf(PropTypes.object).isRequired,
            wan: PropTypes.arrayOf(PropTypes.object).isRequired,
        }).isRequired,
        firewall: PropTypes.shape({
            http_on_wan: PropTypes.bool.isRequired,
            https_on_wan: PropTypes.bool.isRequired,
            ssh_on_wan: PropTypes.bool.isRequired,
        }),
    }),
    formErrors: PropTypes.shape({
        networks: PropTypes.shape({
            lan: PropTypes.string,
        }),
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

InterfacesForm.defaultProps = {
    setFormValue: () => {},
};

export default function InterfacesForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const [selectedID, setSelectedID] = useState(null);
    const [setAlert, dismissAlert] = useAlert();

    useEffect(() => {
        const { firewall } = formData;
        const hasWAN = formData.networks.wan.length > 0;
        if (
            hasWAN &&
            (firewall.http_on_wan ||
                firewall.https_on_wan ||
                firewall.ssh_on_wan)
        ) {
            setAlert(
                _(
                    "Ports are open on your WAN interface. It's better to reconfigure your interface settings to avoid security issues."
                )
            );
        } else {
            dismissAlert();
        }
    }, [formData, setAlert, dismissAlert]);

    function getInterfaceById(id) {
        if (!selectedID) return [null, null, null];

        // eslint-disable-next-line no-unused-vars, no-restricted-syntax
        for (const network of NETWORKS_TYPES) {
            const interfaceIdx = formData.networks[network].findIndex(
                (i) => i.id === id
            );
            if (interfaceIdx !== -1) {
                return [
                    formData.networks[network][interfaceIdx],
                    network,
                    interfaceIdx,
                ];
            }
        }
    }

    const [
        selectedInterface,
        selectedInterfaceNetwork,
        selectedInterfaceIdx,
    ] = getInterfaceById(selectedID);

    function handleNetworkChange(e) {
        setFormValue((value) => ({
            networks: {
                [value]: { $push: [selectedInterface] },
                [selectedInterfaceNetwork]: {
                    $splice: [[selectedInterfaceIdx, 1]],
                },
            },
        }))(e);
    }

    return (
        <>
            <h2>{NETWORKS_CHOICES.wan}</h2>
            <p>
                {_(`
It acts as an external network connection. Firewall rules should be applied here. It can only contain a
single interface.
        `)}
            </p>
            <Network
                interfaces={formData.networks.wan}
                selected={selectedID}
                setSelected={setSelectedID}
                disabled={disabled}
            />
            <h2>{NETWORKS_CHOICES.lan}</h2>
            <p>
                {_(`
It acts as a local network connection. LAN should contain devices which are under your control and you
trust them. These devices can see each other and can access this web interface. It is recommended that the
LAN should contain at least one interface otherwise you might not be able to configure this device in an
easy way.
        `)}
            </p>
            {formErrors && formErrors.networks && formErrors.networks.lan ? (
                <p className="text-danger">{formErrors.networks.lan}</p>
            ) : (
                <Network
                    interfaces={formData.networks.lan}
                    selected={selectedID}
                    setSelected={setSelectedID}
                    disabled={disabled}
                />
            )}
            <h2>{NETWORKS_CHOICES.guest}</h2>
            <p>
                {_(`
It acts as a local network connection. Unlike LAN the devices in the guest network can't access
the configuration interface of this device and are only able to access WAN (internet). This network should
be used for devices which you don't fully trust. Note that you can also limit download/upload speed of the
devices connected to the guest network.
        `)}
            </p>
            <Network
                interfaces={formData.networks.guest}
                selected={selectedID}
                setSelected={setSelectedID}
                disabled={disabled}
            />
            <h2>{NETWORKS_CHOICES.none}</h2>
            <Network
                interfaces={formData.networks.none}
                selected={selectedID}
                setSelected={setSelectedID}
                disabled={disabled}
            />
            {selectedID && (
                <SelectedInterface
                    network={selectedInterfaceNetwork}
                    WANIsEmpty={formData.networks.wan.length === 0}
                    {...selectedInterface}
                    onNetworkChange={handleNetworkChange}
                />
            )}
        </>
    );
}
