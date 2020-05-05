/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
    Button,
    Portal,
    useAlert,
    useAPIPost,
    API_STATE,
    ALERT_TYPES,
    formFieldsSize,
    Modal,
    ModalHeader, ModalBody, ModalFooter,
} from "foris";

import API_URLs from "../common/API";

TestNotification.propTypes = {
    formData: PropTypes.shape({ enabled: PropTypes.bool }).isRequired,
    formErrors: PropTypes.shape({ enabled: PropTypes.bool }),
};

TestNotification.defaultProps = {
    formData: {},
};

export default function TestNotification({ formData, formErrors }) {
    const [postState, post] = useAPIPost(API_URLs.sendTestNotification);
    const [setAlert] = useAlert();
    const [modalShown, setModalShown] = useState(false);

    const [initialFormData, setInitialFormData] = useState(null);
    useEffect(() => {
        if (!initialFormData) {
            setInitialFormData(formData);
        }
    }, [formData, initialFormData]);

    useEffect(() => {
        if (postState.state === API_STATE.SUCCESS) {
            setAlert(postState.data, ALERT_TYPES.SUCCESS);
        } else if (postState.state === API_STATE.ERROR) {
            setAlert(postState.data);
        }
    }, [setAlert, postState]);

    if (!formData.enabled) {
        return null;
    }

    function onTestNotificationHandler() {
        if (JSON.stringify(initialFormData) !== JSON.stringify(formData)) {
            setModalShown(true);
        }
    }

    function onPostHandler() {
        post();
        setModalShown(false);
    }

    const postIsSending = postState.state === API_STATE.SENDING;

    return (
        <>
            <Portal containerId="test-notification">
                <h3>{_("Test notification")}</h3>
                <div className={`${formFieldsSize} text-right`}>
                    <Button
                        forisFormSize
                        loading={postIsSending}
                        disabled={postIsSending || formErrors}

                        onClick={onTestNotificationHandler}
                    >
                        {_("Send testing notification")}
                    </Button>
                </div>
            </Portal>
            <UnsavedChangesWarningModal
                shown={modalShown}
                setShown={setModalShown}
                callback={onPostHandler}
            />
        </>
    );
}

UnsavedChangesWarningModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
};

function UnsavedChangesWarningModal({ shown, setShown, callback }) {
    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody>
                <p>{_("There are some unsaved changes in the notifications settings. Do you want to discard them and test the notifications with the old settings?")}</p>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => setShown(false)}>{_("Cancel")}</Button>
                <Button className="btn-danger" onClick={callback}>{_("Confirm")}</Button>
            </ModalFooter>
        </Modal>
    );
}
