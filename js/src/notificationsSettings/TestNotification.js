/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
    ALERT_TYPES,
    API_STATE,
    buttonFormFieldsSize,
    Alert,
    Button,
    Portal,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useAlert,
    useAPIPost,
} from "foris";

import API_URLs from "../common/API";
import { SEVERITY_OPTIONS } from "./CommonForm";

export const UNSAVED_CHANGES_MODAL_MESSAGE = _(
    "There are some unsaved changes in the notifications settings. Do you want to discard them and test the notifications with the old settings?"
);

export const SEVERITY_ALERT_MESSAGE = _(
    'You will not receive the test notification to your email inbox with current importance level. Please raise the importance level at least to "Reboot or attention is required" and click "Save" button if you want to get this notification by email.'
);

TestNotification.propTypes = {
    formData: PropTypes.shape({
        enabled: PropTypes.bool,
        common: PropTypes.shape({
            severity_filter: PropTypes.oneOf(
                Object.keys(SEVERITY_OPTIONS).map((key) => parseInt(key))
            ).isRequired,
        }),
    }).isRequired,
    initialData: PropTypes.shape({
        enabled: PropTypes.bool,
        common: PropTypes.shape({
            severity_filter: PropTypes.oneOf(
                Object.keys(SEVERITY_OPTIONS).map((key) => parseInt(key))
            ).isRequired,
        }),
    }).isRequired,
    formErrors: PropTypes.shape({ enabled: PropTypes.bool }),
};

TestNotification.defaultProps = {
    formData: {},
    initialData: {},
};

export default function TestNotification({
    formData,
    formErrors,
    initialData,
}) {
    const [postState, post] = useAPIPost(API_URLs.sendTestNotification);
    const [setAlert] = useAlert();
    const [modalShown, setModalShown] = useState(false);

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
        if (JSON.stringify(initialData) !== JSON.stringify(formData)) {
            setModalShown(true);
            return;
        }
        post();
    }

    function onPostHandler() {
        post();
        setModalShown(false);
    }

    const postIsSending = postState.state === API_STATE.SENDING;
    const showSeverityAlert = initialData
        ? initialData.common.severity_filter < 2
        : false;

    return (
        <>
            <Portal containerId="test-notification">
                {showSeverityAlert && (
                    <Alert type={ALERT_TYPES.WARNING}>
                        {SEVERITY_ALERT_MESSAGE}
                    </Alert>
                )}
                    <h2>{_("Test Notification")}</h2>
                    <p>
                        {_(
                            "Here you can verify whether SMTP is configured correctly by sending a test notification to your email inbox."
                        )}
                    </p>
                    <div className="text-right">
                        <Button
                            forisFormSize
                            loading={postIsSending}
                            disabled={postIsSending || formErrors}
                            onClick={onTestNotificationHandler}
                        >
                            {_("Send test notification")}
                        </Button>
                    </div>
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
                <p>{UNSAVED_CHANGES_MODAL_MESSAGE}</p>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => setShown(false)}>{_("Cancel")}</Button>
                <Button className="btn-danger" onClick={callback}>
                    {_("Confirm")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
