/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { Button, TextInput } from "foris";
import PropTypes from "prop-types";

const LABELS = {
    ipv4: _("IPv4"),
    ipv6: _("IPv6"),
};

IPAddressesForm.propTypes = {
    ipVersion: PropTypes.string.isRequired,
    ipaddresses: PropTypes.arrayOf(PropTypes.string).isRequired,
    setFormValue: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
};

export default function IPAddressesForm({
    ipVersion, ipaddresses, setFormValue, errors, disabled,
}) {
    const label = LABELS[ipVersion];
    const addIP = setFormValue(
        () => ({ ipaddresses: { [ipVersion]: { $push: [""] } } }),
    );

    function deleteIPByIndex(index) {
        return setFormValue(
            () => ({ ipaddresses: { [ipVersion]: { $splice: [[index, 1]] } } }),
        );
    }

    function setIPByIndex(index) {
        return setFormValue(
            (value) => ({ ipaddresses: { [ipVersion]: { [index]: { $set: value } } } }),
        );
    }

    return (
        <>
            <h5>{_(`${label} Addresses`)}</h5>
            <div className="offset-1 col-10">
                {ipaddresses.map((ipaddress, index) => (
                    <TextInput
                        key={index.toString()}
                        label={_(`${label} #${index + 1}`)}
                        value={ipaddress}
                        error={(errors || [])[index]}

                        onChange={setIPByIndex(index)}
                        disabled={disabled}
                    >
                        {index !== 0 && (
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    className="btn-danger input-group-text"
                                    onClick={deleteIPByIndex(index)}
                                >
                                    <i className="fa fa-trash" />
                                </button>
                            </div>
                        )}
                    </TextInput>
                ))}
                { ipaddresses.length < 2
                    && (
                        <Button className="btn-outline-success btn-sm col-12 mb-2" onClick={addIP}>
                            {_(`Add ${label} address`)}
                        </Button>
                    )}
            </div>
        </>
    );
}
