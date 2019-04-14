/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import {useForisForm} from './hooks';
import SubmitButton from './SubmitButton';

ForisForm.propTypes = {
    ws: propTypes.object.isRequired,
    module: propTypes.string.isRequired,
    prepData: propTypes.func.isRequired,
    prepDataToSubmit: propTypes.func.isRequired,
    validator: propTypes.func.isRequired,
    children: propTypes.node.isRequired,
};

export default function ForisForm({ws, module, prepData, prepDataToSubmit, validator, children}) {
    const [
        formData,
        formErrors,
        formState,
        remindsToNWRestart,
        formIsDisabled,

        setFormValue,
        onSubmit,
    ] = useForisForm(ws, module, prepData, prepDataToSubmit, validator);

    if (JSON.stringify(formData) === '{}')
        return null;

    const childrenWithFormProps = React.Children.map(
        children, child =>
            React.cloneElement(child, {
                formData: formData,
                formErrors: formErrors,
                disabled: formIsDisabled,
                setFormValue: setFormValue,
            })
    );

    return <form onSubmit={onSubmit}>
        {childrenWithFormProps}
        <SubmitButton
            state={formState}
            remindsToNWRestart={remindsToNWRestart}
            disabled={!!formErrors}
        />
    </form>
}
