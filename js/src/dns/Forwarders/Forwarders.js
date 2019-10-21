/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Button, Spinner, WebSockets,
} from "foris";

import ForwardersTable from "./ForwardersTable";
import useForwardersList from "./hooks";
import ForwarderModal from "./Forwarder/ForwarderModal";

Forwarders.propTypes = {
    value: PropTypes.string,
    setFormValue: PropTypes.func,
    ws: PropTypes.instanceOf(WebSockets),
    disabled: PropTypes.bool,
};

export default function Forwarders({
    value, setFormValue, ws, disabled,
}) {
    const [forwarderList, forwarderListIsLoading] = useForwardersList(ws);

    const [forwarderToEdit, setForwarderToEdit] = useState(null);
    const [forwarderModalShown, setForwarderModalShown] = useState(false);

    function editForwarder(forwarder) {
        setForwarderToEdit(forwarder);
        setForwarderModalShown(true);
    }

    function addForwarder() {
        setForwarderToEdit(null);
        setForwarderModalShown(true);
    }

    if (forwarderListIsLoading || !forwarderList) {
        return <Spinner />;
    }

    return (
        <>
            <ForwardersTable
                forwarders={forwarderList}
                selectedForwarder={value}
                setFormValue={setFormValue}
                editForwarder={editForwarder}
                disabled={disabled}
            />
            <AddForwarderButton onClick={() => addForwarder()} />
            <ForwarderModal
                shown={forwarderModalShown}
                setShown={setForwarderModalShown}
                forwarder={forwarderToEdit}
                title={forwarderToEdit ? _("Edit forwarder") : _("Add custom forwarder")}
            />
        </>
    );
}

AddForwarderButton.propTypes = {
    onClick: PropTypes.func,
};

function AddForwarderButton({ onClick }) {
    return (
        <Button forisFormSize className="btn-outline-success btn-sm" onClick={onClick}>
            {_("Add custom forwarder")}
        </Button>
    );
}
