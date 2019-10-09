/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Button, Spinner, useAPIPost, WebSockets,
} from "foris";

import API_URLs from "common/API";
import ForwardersTable from "./ForwardersTable";
import EditForwarder from "./EditForwarder";
import { useForwardersList } from "./hooks";

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

    const [deleteForwarderStatus, deleteForwarder] = useAPIPost(API_URLs.dnsDeleteForwarder);
    const [editForwarderModalShown, setEditForwarderModalShown] = useState(false);
    function editForwarder(forwarder) {
        setForwarderToEdit(forwarder);
        setEditForwarderModalShown(true);
    }

    const [addForwarderModalShown, setAddForwarderModalShown] = useState(false);

    if (forwarderListIsLoading || !forwarderList) {
        return <Spinner />;
    }

    return (
        <>
            <ForwardersTable
                forwarders={forwarderList}
                value={value}
                setFormValue={setFormValue}
                editForwarder={editForwarder}
                deleteForwarder={deleteForwarder}
                disabled={disabled || deleteForwarderStatus.isSending}
            />
            <AddForwarderButton onClick={() => setAddForwarderModalShown(true)} />
            <EditForwarder
                shown={addForwarderModalShown}
                setShown={setAddForwarderModalShown}
                forwarders={forwarderList}
            />
            <EditForwarder
                shown={editForwarderModalShown}
                setShown={setEditForwarderModalShown}
                forwarder={forwarderToEdit}
                forwarders={forwarderList}
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
            <i className="fas fa-plus" />
        </Button>
    );
}
