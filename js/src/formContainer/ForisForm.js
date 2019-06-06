/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect, useState} from 'react';
import propTypes from 'prop-types';

import Spinner from '../common/bootstrap/Spinner';
import {useAPIPost} from '../common/APIhooks';

import {useForisModule, useForm} from './hooks';
import SubmitButton, {STATES as SUBMIT_BUTTON_STATES} from './SubmitButton';
import {FailAlert, SuccessAlert} from './alerts';

ForisForm.propTypes = {
    ws: propTypes.object,
    forisConfig: propTypes.shape({
        endpoint: propTypes.string.isRequired,
        wsModule: propTypes.string,
        wsAction: propTypes.string,
    }).isRequired,
    prepData: propTypes.func.isRequired,
    prepDataToSubmit: propTypes.func.isRequired,
    validator: propTypes.func.isRequired,
    children: propTypes.node.isRequired,
};

ForisForm.defaultProps = {
    prepData: data => data,
    prepDataToSubmit: data => data,
    validator: () => undefined,
};

export default function ForisForm({
                                      ws,
                                      forisConfig,
                                      prepData,
                                      prepDataToSubmit,
                                      validator,
                                      disabled,
                                      onSubmitOverridden,
                                      children
                                  }) {
    const [formState, onFormChangeHandler, resetFormData] = useForm(validator, prepData);

    const [forisModuleState] = useForisModule(ws, forisConfig);
    useEffect(() => {
        if (forisModuleState.data) {
            resetFormData(forisModuleState.data)
        }
    }, [forisModuleState.data, resetFormData, prepData]);

    const [postState, post] = useAPIPost(forisConfig.endpoint);

    function onSubmitHandler(e) {
        e.preventDefault();
        resetFormData();
        const copiedFormData = JSON.parse(JSON.stringify(formState.data));
        const preparedData = prepDataToSubmit(copiedFormData);
        post(preparedData);
    }

    function getSubmitButtonState() {
        if (postState.isSending)
            return SUBMIT_BUTTON_STATES.SAVING;
        else if (forisModuleState.isLoading)
            return SUBMIT_BUTTON_STATES.LOAD;
        return SUBMIT_BUTTON_STATES.READY;
    }

    const [alertIsDismissed, setAlertIsDismissed] = useState(false);

    if (!formState.data)
        return <Spinner className='row justify-content-center'/>;

    const formIsDisabled = disabled || forisModuleState.isLoading || postState.isSending;
    const submitButtonIsDisabled = disabled || !!formState.errors;

    const childrenWithFormProps =
        React.Children.map(children, child =>
            React.cloneElement(child, {
                formData: formState.data,
                formErrors: formState.errors,
                setFormValue: onFormChangeHandler,
                disabled: formIsDisabled,
            })
        );

    const onSubmit = onSubmitOverridden ?
        onSubmitOverridden(formState.data, onFormChangeHandler, onSubmitHandler) : onSubmitHandler;

    return <>
        {!alertIsDismissed ?
            postState.isSuccess ?
                <SuccessAlert onDismiss={() => setAlertIsDismissed(true)}/>
                : postState.isError ?
                <FailAlert onDismiss={() => setAlertIsDismissed(true)}/>
                : null
            : null
        }
        <form onSubmit={onSubmit}>
            {childrenWithFormProps}
            <SubmitButton
                state={getSubmitButtonState()}
                disabled={submitButtonIsDisabled}
            />
        </form>
    </>
}
