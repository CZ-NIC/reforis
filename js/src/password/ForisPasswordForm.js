/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import PasswordInput from 'common/bootstrap/PasswordInput';
import CheckBox from 'common/bootstrap/Checkbox';
import SubmitButton, {STATES as SUBMIT_BUTTON_STATES} from 'formContainer/SubmitButton';


ForisPasswordForm.propTypes = {
    formData: propTypes.shape(
        {newForisPassword: propTypes.string}
    ).isRequired,
    submitButtonState: propTypes.oneOf(
        Object.keys(SUBMIT_BUTTON_STATES).map(key => SUBMIT_BUTTON_STATES[key])
    ).isRequired,
    formErrors: propTypes.shape({}),
    setFormValue: propTypes.func.isRequired,
    postForisPassword: propTypes.func.isRequired,
};

export default function ForisPasswordForm({formData, formErrors, setFormValue, submitButtonState, postForisPassword, ...props}) {
    return <form onSubmit={postForisPassword}>
        <h4>{_('Foris password')}</h4>
        <p>{_('Set your password for this administration interface.')}</p>
        <PasswordInput
            withEye={true}
            label={_('New Foris password')}
            value={formData.newForisPassword}
            error={formErrors.newForisPassword}


            onChange={setFormValue(
                value => ({newForisPassword: {$set: value}})
            )}

            {...props}
        />
        <CheckBox
            label={_('Use same password for advanced administration (root)')}
            helpText={_('Same password would be used for accessing this administration interface, for root user in ' +
                'LuCI web interface and for SSH login. Use a strong password! (If you choose not to set the password ' +
                'for advanced configuration here, you will have the option to do so later. Until then, the root account ' +
                'will be blocked.)'
            )}
            checked={formData.sameForRoot}

            onChange={setFormValue(
                value => ({sameForRoot: {$set: value}})
            )}

            {...props}
        />
        <SubmitButton
            state={submitButtonState}
            disabled={!!formErrors.newForisPassword}
        />
    </form>
}
