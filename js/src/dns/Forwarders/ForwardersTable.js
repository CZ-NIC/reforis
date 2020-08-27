/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { Button, useAPIDelete, API_STATE } from "foris";

import API_URLs from "common/API";

import forwarderPropTypes from "./propTypes";
import PROVIDER_FORWARDER from "../constants";

ForwardersTable.propTypes = {
    forwarders: PropTypes.arrayOf(PropTypes.object),
    selectedForwarder: PropTypes.string,
    setFormValue: PropTypes.func,
    editForwarder: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function ForwardersTable({
    forwarders,
    selectedForwarder,
    setFormValue,
    editForwarder,
    disabled,
}) {
    return (
        <div className="table-responsive">
            <table className="table col-12">
                <thead className="thead-light">
                    <tr>
                        <th>{_("Forwarders")}</th>
                        <th aria-label={_("Actions")} />
                    </tr>
                </thead>
                <tbody>
                    <ForwardersTableRow
                        forwarder={{
                            name: PROVIDER_FORWARDER,
                            description: _("Use provider's DNS resolver"),
                        }}
                        active={selectedForwarder === PROVIDER_FORWARDER}
                        setFormValue={setFormValue}
                        disabled={disabled}
                    />
                    {forwarders.map((forwarder) => (
                        <ForwardersTableRow
                            key={forwarder.name}
                            forwarder={forwarder}
                            active={forwarder.name === selectedForwarder}
                            setFormValue={setFormValue}
                            editForwarder={editForwarder}
                            disabled={disabled}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

ForwardersTableRow.propTypes = {
    forwarder: forwarderPropTypes,
    active: PropTypes.bool,
    setFormValue: PropTypes.func,
    editForwarder: PropTypes.func,
    deleteForwarder: PropTypes.func,
    disabled: PropTypes.bool,
};

function ForwardersTableRow({
    forwarder,
    active,
    setFormValue,
    editForwarder,
    deleteForwarder,
    disabled,
}) {
    return (
        <tr>
            <td>
                <div className="custom-control custom-radio">
                    <input
                        checked={active}
                        type="radio"
                        id={forwarder.name}
                        value={forwarder.name}
                        name="dns-forwarders"
                        className="custom-control-input"
                        onChange={setFormValue((value) => ({
                            forwarder: { $set: value },
                        }))}
                        disabled={disabled}
                    />
                    <label
                        className="custom-control-label"
                        htmlFor={forwarder.name}
                    >
                        {forwarder.description || forwarder.name}
                    </label>
                </div>
            </td>
            <td align="right">
                {forwarder.editable && (
                    <ForwarderActions
                        forwarder={forwarder}
                        editForwarder={editForwarder}
                        deleteForwarder={() => deleteForwarder(forwarder.name)}
                    />
                )}
            </td>
        </tr>
    );
}

ForwarderActions.propTypes = {
    forwarder: forwarderPropTypes,
    editForwarder: PropTypes.func,
    disabled: PropTypes.bool,
};

function ForwarderActions({ forwarder, editForwarder, disabled }) {
    const [deleteForwarderResponse, deleteForwarder] = useAPIDelete(
        `${API_URLs.dnsForwarders}/${forwarder.name}`
    );
    const buttonDisabled =
        disabled || deleteForwarderResponse.state === API_STATE.SENDING;

    return (
        <div className="btn-group mb-0" role="group">
            <Button
                onClick={() => editForwarder(forwarder)}
                className="btn-primary btn-sm"
                disabled={buttonDisabled}
            >
                <i className="fas fa-edit fa-sm mr-1" />
                {_("Edit")}
            </Button>
            <Button
                onClick={deleteForwarder}
                className="btn-danger btn-sm"
                disabled={buttonDisabled}
            >
                <i className="fas fa-trash fa-sm mr-1" />
                {_("Delete")}
            </Button>
        </div>
    );
}
