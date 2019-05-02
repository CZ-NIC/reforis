/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import CheckBox from '../../common/bootstrap/Checkbox';
import RestartAfterUpdateForm from './RestartAfterUpdateForm';
import UpdateApprovalsForm from './UpdateApprovalsForm';

UpdatesForm.defaultProps = {
    formErrors: {}
};

export default function UpdatesForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <CheckBox
            label={_('Enable automatic updates (recommended)')}
            checked={formData.enabled}

            onChange={setFormValue(value => ({enabled: {$set: value}}))}

            {...props}
        />
        {formData.enabled ?
            <UpdateApprovalsForm
                formData={formData.approval_settings}

                setFormValue={setFormValue}

                {...props}
            />
            : null}
        <RestartAfterUpdateForm
            formData={formData.reboots}
            formErrors={formErrors.reboots}
            setFormValue={setFormValue}

            {...props}
        />
    </>
}
