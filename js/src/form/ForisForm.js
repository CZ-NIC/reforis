/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Spinner } from "foris";
import { useAPIPost } from "common/APIhooks";

import { Prompt } from "react-router";
import { useForisModule, useForm } from "./hooks";
import SubmitButton, { STATES as SUBMIT_BUTTON_STATES } from "./SubmitButton";
import { FailAlert, SuccessAlert } from "./alerts";

ForisForm.propTypes = {
    /** WebSocket object see `scr/common/WebSockets.js`. */
    ws: PropTypes.object,
    /** Foris configuration object. See usage in main components. */
    forisConfig: PropTypes.shape({
        /** reForis Flask aplication API endpoint from `src/common/API.js`. */
        endpoint: PropTypes.string.isRequired,
        /** `foris-controller` module name to be used via WebSockets.
         *  If it's not passed then WebSockets aren't used
         * */
        wsModule: PropTypes.string,
        /** `foris-controller` action name to be used via WebSockets.
         *  If it's not passed then `update_settings` is used. see `src/common/WebSocketHooks.js`
         * */
        wsAction: PropTypes.string,
    }).isRequired,
    /** Function to prepare data recived from the API before using in forms. */
    prepData: PropTypes.func.isRequired,
    /** Function to prepare data from form before submitting. */
    prepDataToSubmit: PropTypes.func.isRequired,
    /** Function to handle response to POST request. */
    postCallback: PropTypes.func.isRequired,
    /** Validate data and provide validation object. Then validation errors passed to children. */
    validator: PropTypes.func.isRequired,
    /** Disables form */
    disabled: PropTypes.bool,
    /** reForis form components. */
    children: PropTypes.node.isRequired,
    /** Optional override of form submit callback */
    onSubmitOverridden: PropTypes.func,
};

ForisForm.defaultProps = {
    prepData: (data) => data,
    prepDataToSubmit: (data) => data,
    postCallback: () => undefined,
    validator: () => undefined,
    disabled: false,
};

/** Serves as HOC for all foris forms components. */
export default function ForisForm({
    ws,
    forisConfig,
    prepData,
    prepDataToSubmit,
    postCallback,
    validator,
    disabled,
    onSubmitOverridden,
    children,
}) {
    const [formState, onFormChangeHandler, resetFormData] = useForm(validator, prepData);

    const [forisModuleState] = useForisModule(ws, forisConfig);
    useEffect(() => {
        if (forisModuleState.data) {
            resetFormData(forisModuleState.data);
        }
    }, [forisModuleState.data, resetFormData, prepData]);

    const [postState, post] = useAPIPost(forisConfig.endpoint);
    useEffect(() => {
        if (postState.isSuccess) postCallback();
    }, [postCallback, postState.isSuccess]);


    function onSubmitHandler(e) {
        e.preventDefault();
        resetFormData();
        const copiedFormData = JSON.parse(JSON.stringify(formState.data));
        const preparedData = prepDataToSubmit(copiedFormData);
        post(preparedData);
    }

    function getSubmitButtonState() {
        if (postState.isSending) return SUBMIT_BUTTON_STATES.SAVING;
        if (forisModuleState.isLoading) return SUBMIT_BUTTON_STATES.LOAD;
        return SUBMIT_BUTTON_STATES.READY;
    }

    const [alertIsDismissed, setAlertIsDismissed] = useState(false);

    if (!formState.data) return <Spinner className="row justify-content-center" />;

    const formIsDisabled = disabled || forisModuleState.isLoading || postState.isSending;
    const submitButtonIsDisabled = disabled || !!formState.errors;

    const childrenWithFormProps = React.Children.map(
        children,
        (child) => React.cloneElement(child, {
            formData: formState.data,
            formErrors: formState.errors,
            setFormValue: onFormChangeHandler,
            disabled: formIsDisabled,
        }),
    );

    const onSubmit = onSubmitOverridden
        ? onSubmitOverridden(formState.data, onFormChangeHandler, onSubmitHandler)
        : onSubmitHandler;

    function getMessageOnLeavingPage() {
        if (JSON.stringify(formState.data) === JSON.stringify(formState.initialData)) return true;
        return _("Changes you made may not be saved. Are you sure you want to leave?");
    }

    let alert = null;
    if (!alertIsDismissed) {
        if (postState.isSuccess) {
            alert = <SuccessAlert onDismiss={() => setAlertIsDismissed(true)} />;
        } else if (postState.isError) {
            alert = <FailAlert onDismiss={() => setAlertIsDismissed(true)} />;
        }
    }

    return (
        <>
            <Prompt message={getMessageOnLeavingPage} />
            {alert}
            <form onSubmit={onSubmit}>
                {childrenWithFormProps}
                <SubmitButton
                    state={getSubmitButtonState()}
                    disabled={submitButtonIsDisabled}
                />
            </form>
        </>
    );
}
