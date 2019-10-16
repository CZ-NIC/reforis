/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { Button } from "foris";

import forwarderPropTypes from "./propTypes";

ForwardersTable.propTypes = {
    forwarders: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.string,
    setFormValue: PropTypes.func,
    editForwarder: PropTypes.func,
    deleteForwarder: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function ForwardersTable({
    forwarders, value, setFormValue, editForwarder, deleteForwarder, disabled,
}) {
    return (
        <table className="table offset-lg-1 col-lg-10">
            <thead>
                <tr>
                    <th>{_("Forwarders")}</th>
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <th />
                </tr>
            </thead>
            <tbody>
                <ForwardersTableRow
                    forwarder={{
                        name: "null",
                        description: _("Use provider's DNS resolver"),
                    }}
                    active={value === "null"}
                    setFormValue={setFormValue}
                    disabled={disabled}
                />
                {forwarders.map(
                    (forwarder) => (
                        <ForwardersTableRow
                            key={forwarder.name}
                            forwarder={forwarder}
                            active={forwarder.name === value}
                            setFormValue={setFormValue}
                            editForwarder={editForwarder}
                            deleteForwarder={deleteForwarder}
                            disabled={disabled}
                        />
                    ),
                )}
            </tbody>
        </table>
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
    forwarder, active, setFormValue, editForwarder, deleteForwarder, disabled,
}) {
    return (
        <tr className={active ? "table-secondary" : ""}>
            <td>
                <div className="custom-control custom-radio">
                    <input
                        checked={active}
                        type="radio"
                        id={forwarder.name}
                        value={forwarder.name}
                        name="dns-forwarders"
                        className="custom-control-input"
                        onChange={setFormValue((value) => ({ forwarder: { $set: value } }))}
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
            <td align="center">
                {forwarder.editable ? (
                    <EditForwarderButtons
                        forwarder={forwarder}
                        editForwarder={editForwarder}
                        deleteForwarder={() => deleteForwarder({ name: forwarder.name })}
                    />
                ) : null}
            </td>
        </tr>
    );
}

EditForwarderButtons.propTypes = {
    forwarder: forwarderPropTypes,
    editForwarder: PropTypes.func,
    deleteForwarder: PropTypes.func,
    disabled: PropTypes.bool,
};

function EditForwarderButtons({
    forwarder, editForwarder, deleteForwarder, disabled,
}) {
    return (
        <div className="btn-group" role="group">
            <Button
                onClick={() => editForwarder(forwarder)}
                className="btn-primary btn-sm"
                disabled={disabled}
            >
                {_("Edit")}
            </Button>
            <Button
                onClick={deleteForwarder}
                className="btn-danger btn-sm"
                disabled={disabled}
            >
                {_("Delete")}
            </Button>
        </div>
    );
}
