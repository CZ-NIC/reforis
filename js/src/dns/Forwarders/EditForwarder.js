/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
    Alert, Button, Modal, ModalBody, ModalHeader, Spinner,
} from "foris";
import ForwarderForm from "./ForwarderForm";
import { useForwarderForm } from "./hooks";

EditForwarder.propTypes = {
    forwarder: PropTypes.object,
    shown: PropTypes.bool,
    setShown: PropTypes.func,
};

export default function EditForwarder({
    shown, setShown, forwarder,
}) {
    const [formState, setFormValue, postState, saveForwarder] = useForwarderForm(forwarder);

    const [alert, setAlert] = useState();
    useEffect(() => {
        if (postState.isSuccess) {
            setShown(false);
            setAlert(null);
        } else if (postState.isError) {
            setAlert({
                type: "danger",
                message: _("Can't save forwarder."),
            });
        }
    }, [postState.isError, postState.isSuccess, setShown]);

    function onSaveForwarderHandler(event) {
        event.preventDefault();
        saveForwarder();
        setShown(false);
    }

    const disabled = postState.isSending;

    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader
                setShown={setShown}
                title={forwarder ? _("Edit forwarder") : _("Add new forwarder")}
            />
            <ModalBody>
                {alert ? (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onDismiss={() => setAlert(null)}
                    />
                ) : null}
                {formState.data
                    ? (
                        <>
                            <ForwarderForm
                                formData={formState.data}
                                formErrors={formState.errors}
                                setFormValue={setFormValue}
                                disabled={disabled}
                            />
                            <Button
                                onClick={onSaveForwarderHandler}
                                forisFormSize
                                disabled={!!formState.errors}
                            >

                                {_("Save forwarder")}
                            </Button>
                        </>
                    )
                    : <Spinner className="text-center" />}
            </ModalBody>
        </Modal>
    );
}
