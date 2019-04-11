/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {useForisForm} from './hooks';
import SubmitButton from './SubmitButton';

export default function ForisForm({module, prepData, prepDataToSubmit, validator, children}) {
    const [
        formData,
        formErrors,
        formState,
        remindsToNWRestart,
        formIsDisabled,

        setFormValue,
        onSubmit,
    ] = useForisForm(module, prepData, prepDataToSubmit, validator);

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
            disabled={!!formErrors}
            state={formState}
            remindsToNWRestart={remindsToNWRestart}
        />
    </form>
}
