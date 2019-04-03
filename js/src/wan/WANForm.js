/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import Select from "../bootstrap/Select";
import TextInput from "../bootstrap/TextInput";
import {validateDomain, validateIPv4Address} from "../settingsHelpers/validation";

const HELP_TEXTS = {
    dns: _('DNS server address is not required as the built-in DNS resolver is capable of working without it.')
};

const WAN_CHOICES = {
    dhcp: _('DHCP (automatic configuration)'),
    static: _('Static IP address (manual configuration)'),
    pppoe: _('PPPoE (for DSL bridges, Modem Turris, etc.)'),
};

export default class WANForm extends React.PureComponent {

    static dhcpForm = props =>
        props.formData ?
            <TextInput
                label={_('DHCP hostname')}
                value={props.formData.hostname || ''}
                disabled={props.disabled}
                error={(props.errors || {}).hostname || null}

                onChange={props.changeFormData(
                    value => ({wan_settings: {wan_dhcp: {hostname: {$set: value}}}})
                )}
            /> : null;

    static staticForm = props => {
        if (!props.formData) return null;
        const errors = (props.errors || {});
        return <>
            <TextInput
                label={_('IP address')}
                value={props.formData.ip || ''}
                disabled={props.disabled}
                error={errors.ip || null}
                required

                onChange={props.changeFormData(
                    value => ({wan_settings: {wan_static: {ip: {$set: value}}}})
                )}
            />
            <TextInput
                label={_('Network mask')}
                value={props.formData.netmask || ''}
                disabled={props.disabled}
                error={errors.netmask || null}
                required

                onChange={props.changeFormData(
                    value => ({wan_settings: {wan_static: {netmask: {$set: value}}}})
                )}
            />
            <TextInput
                label={_('Gateway')}
                value={props.formData.gateway || ''}
                disabled={props.disabled}
                error={errors.gateway || null}
                required

                onChange={props.changeFormData(
                    value => ({wan_settings: {wan_static: {gateway: {$set: value}}}})
                )}
            />
            <TextInput
                label={_('DNS server 1')}
                value={props.formData.dns1 || ''}
                disabled={props.disabled}
                error={errors.dns1 || null}
                helpText={HELP_TEXTS.dns}

                onChange={props.changeFormData(
                    value => ({wan_settings: {wan_static: {dns1: {$set: value}}}})
                )}
            />
            <TextInput
                label={_('DNS server 2')}
                value={props.formData.dns2 || ''}
                disabled={props.disabled}
                error={errors.dns2 || null}
                helpText={HELP_TEXTS.dns}

                onChange={props.changeFormData(
                    value => ({wan_settings: {wan_static: {dns2: {$set: value}}}})
                )}
            />
        </>
    };

    static pppoeForm = props => <>
        <TextInput
            label={_('PAP/CHAP username')}
            value={props.formData.username || ''}
            disabled={props.disabled}
            error={(props.errors || {}).username || null}
            required

            onChange={props.changeFormData(
                value => ({wan_settings: {wan_pppoe: {username: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('PAP/CHAP password')}
            value={props.formData.password || ''}
            disabled={props.disabled}
            error={(props.errors || {}).password || null}
            required

            onChange={props.changeFormData(
                value => ({wan_settings: {wan_pppoe: {password: {$set: value}}}})
            )}
        />
    </>;

    static validate = formData => {
        let errors = {};
        switch (formData.wan_type) {
            case 'dhcp':
                errors.wan_dhcp = WANForm.validateDHCP(formData.wan_dhcp);
                break;
            case 'static':
                errors.wan_static = WANForm.validateStatic(formData.wan_static);
                break;
            case 'pppoe':
                errors.wan_pppoe = WANForm.validatePPPOE(formData.wan_pppoe);
                break;
        }
        return errors['wan_' + formData.wan_type] ? errors : null;
    };

    static validateDHCP = wan_dhcp => {
        const error = {hostname: validateDomain(wan_dhcp.hostname)};
        return error.hostname ? error : null;
    };


    static validateStatic(wan_static) {
        let errors = {};
        ['ip', 'netmask', 'gateway', 'dns1', 'dns2'].forEach(
            field => {
                let error = validateIPv4Address(wan_static[field]);
                if (error)
                    errors[field] = error;
            }
        );
        ['ip', 'netmask', 'gateway'].forEach(
            field => {
                if (!wan_static[field] || wan_static[field] === '')
                    errors[field] = _('This field is required.');
            }
        );

        return JSON.stringify(errors) !== '{}' ? errors : null;
    }

    static validatePPPOE(wan_pppoe) {
        let errors = {};
        ['username', 'password'].forEach(
            field => {
                if (!wan_pppoe[field] || wan_pppoe[field] === '')
                    errors[field] = _('This field is required.');
            }
        );
        return JSON.stringify(errors) !== '{}' ? errors : null;
    }

    render() {
        const wanType = this.props.formData.wan_type;

        return (
            <>
                <Select
                    label={_('IPv4 protocol')}
                    value={wanType}
                    choices={WAN_CHOICES}
                    disabled={this.props.disabled}
                    onChange={this.props.changeFormData(
                        value => ({wan_settings: {wan_type: {$set: value}}})
                    )}
                />
                {
                    wanType === 'dhcp' ?
                        <WANForm.dhcpForm
                            formData={this.props.formData.wan_dhcp}
                            errors={this.props.errors.wan_dhcp}
                            disabled={this.props.disabled}

                            changeFormData={this.props.changeFormData}
                        />
                        : wanType === 'static' ?
                        <WANForm.staticForm
                            formData={this.props.formData.wan_static}
                            errors={this.props.errors.wan_static}
                            disabled={this.props.disabled}

                            changeFormData={this.props.changeFormData}
                        />
                        : wanType === 'pppoe' ?
                            <WANForm.pppoeForm
                                formData={this.props.formData.wan_pppoe}
                                errors={this.props.errors.wan_pppoe}
                                disabled={this.props.disabled}

                                changeFormData={this.props.changeFormData}
                            />
                            : null
                }
            </>
        );
    }
}
