/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Select from 'common/bootstrap/Select';
import TextInput from 'common/bootstrap/TextInput';
import DHCPClientForm, {validateDHCPForm} from 'common/network/DHCPClientForm';
import StaticIPForm, {validateStaticForm} from 'common/network/StaticIPForm';

const WAN_TYPES = {
    dhcp: 'dhcp',
    static: 'static',
    pppoe: 'pppoe',
};

const WAN_TYPE_CHOICES = {
    dhcp: _('DHCP (automatic configuration)'),
    static: _('Static IP address (manual configuration)'),
    pppoe: _('PPPoE (for DSL bridges, Modem Turris, etc.)'),
};

const FIELDS_PROP_TYPES = {
    wan_static: PropTypes.object,
    wan_dhcp: PropTypes.object,
    wan_pppoe: PropTypes.object,
};

WANForm.propTypes = {
    formData: PropTypes.shape({
            wan_settings: PropTypes.shape({
                wan_type: PropTypes.string.isRequired,
                ...FIELDS_PROP_TYPES
            })
        }
    ).isRequired,
    formErrors: PropTypes.shape(FIELDS_PROP_TYPES),
    setFormValue: PropTypes.func.isRequired,
};

WANForm.defaultProps = {
    setFormValue: () => {},
    formData: {},
};

export default function WANForm({formData, formErrors, setFormValue, ...props}) {
    const wanSettings = formData.wan_settings;
    const errors = (formErrors || {}).wan_settings || {};
    const wanType = wanSettings.wan_type;
    return <>
        <h3>{_('WAN IPv4')}</h3>
        <Select
            label={_('IPv4 protocol')}
            value={wanType}
            choices={WAN_TYPE_CHOICES}

            onChange={setFormValue(
                value => ({wan_settings: {wan_type: {$set: value}}})
            )}

            {...props}
        />
        {wanType === WAN_TYPES.dhcp ?
            <DHCPClientForm
                formData={wanSettings.wan_dhcp}
                formErrors={errors.wan_dhcp}

                updateRule={value => ({wan_settings: {wan_dhcp: value}})}
                setFormValue={setFormValue}

                {...props}
            />
            : wanType === WAN_TYPES.static ?
                <StaticIPForm
                    formData={wanSettings.wan_static}
                    formErrors={errors.wan_static || {}}

                    updateRule={value => ({wan_settings: {wan_static: value}})}
                    setFormValue={setFormValue}

                    {...props}
                />
                : wanType === WAN_TYPES.pppoe ?
                    <PPPoEForm
                        formData={wanSettings.wan_pppoe}
                        formErrors={errors.wan_pppoe}

                        setFormValue={setFormValue}

                        {...props}
                    />
                    : null}
    </>

}

PPPoEForm.propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
};

PPPoEForm.defaultProps = {
    formErrors: {},
};

function PPPoEForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <TextInput
            label={_('PAP/CHAP username')}
            value={formData.username || ''}
            error={(formErrors || {}).username || null}
            required

            onChange={setFormValue(
                value => ({wan_settings: {wan_pppoe: {username: {$set: value}}}})
            )}

            {...props}
        />
        <TextInput
            label={_('PAP/CHAP password')}
            value={formData.password || ''}
            error={(formErrors || {}).password || null}
            required

            onChange={setFormValue(
                value => ({wan_settings: {wan_pppoe: {password: {$set: value}}}})
            )}

            {...props}
        />
    </>

}


export function validateWANForm(formData) {
    let errors = {};
    switch (formData.wan_type) {
        case WAN_TYPES.dhcp:
            errors.wan_dhcp = validateDHCPForm(formData.wan_dhcp);
            break;
        case WAN_TYPES.static:
            errors.wan_static = validateStaticForm(formData.wan_static);
            break;
        case WAN_TYPES.pppoe:
            errors.wan_pppoe = validatePPPoEForm(formData.wan_pppoe);
            break;
        default:
    }
    return errors[`wan_${formData.wan_type}`] ? errors : null;
}


function validatePPPoEForm(wan_pppoe) {
    let errors = {};
    ['username', 'password'].forEach(
        field => {
            if (!wan_pppoe[field] || wan_pppoe[field] === '')
                errors[field] = _('This field is required.');
        }
    );
    return JSON.stringify(errors) !== '{}' ? errors : null;
}
