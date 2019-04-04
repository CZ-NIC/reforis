/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import Select from '../bootstrap/Select';
import TextInput from '../bootstrap/TextInput';
import CheckBox from '../bootstrap/Checkbox';
import NumberInput from '../bootstrap/NumberInput';
import {
    validateDUID,
    validateIPv4Address,
    validateIPv6Address,
    validateIPv6Prefix
} from '../forisForm/validation';

const HELP_TEXTS = {
    dhcpv6: {
        duid: _('DUID which will be provided to the DHCPv6 server.'),
    },

    static: {
        ip: _('IPv6 address and prefix length for WAN interface e.g. 2001:db8:be13:37da::1/64'),
        network: _('Address range for local network, e.g. 2001:db8:be13:37da::/64'),
        dns: _('DNS server address is not required as the built-in DNS resolver is capable of working without it.')
    },

    '6to4': {
        ipv4_address: _('In order to use 6to4 protocol, you might need to specify your public IPv4 address ' +
            'manually (e.g. when your WAN interface has a private address which is mapped to public IP).'),
    },

    '6in4': {
        server_ipv4: _('This address will be used as a endpoint of the tunnel on the provider\'s side.'),
        ipv6_prefix: _('IPv6 addresses which will be routed to your network.'),
        mtu: _('Maximum Transmission Unit in the tunnel (in bytes).'),

        dynamic_ipv4: {
            enabled: _('Some tunnel providers allow you to have public dynamic IPv4. Note that you need to ' +
                'fill in some extra fields to make it work.'),
            tunnel_id: _('ID of your tunnel which was assigned to you by the provider.'),
            username: _('Username which will be used to provide credentials to your tunnel provider.'),
            password_or_key: _('Key which will be used to provide credentials to your tunnel provider.'),
        }
    },
};


const WAN6_CHOICES = {
    none: _('Disable IPv6'),
    dhcpv6: _('DHCPv6 (automatic configuration)'),
    static: _('Static IP address (manual configuration)'),
    '6to4': _('6to4 (public IPv4 address required)'),
    '6in4': _('6in4 (public IPv4 address required)'),
};

export default function WAN6Form(props) {
    const wan6Type = props.formData.wan6_settings.wan6_type;
    const formData = props.formData.wan6_settings;
    const last_seen_duid = formData.last_seen_duid;
    const errors = (props.formErrors || {}).wan6_settings || {};

    return <>
        <h3>{_('WAN IPv6')}</h3>
        <Select
            label={_('IPv6 protocol')}
            value={wan6Type}
            choices={WAN6_CHOICES}
            disabled={props.disabled}
            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_type: {$set: value}}})
            )}
        />
        {wan6Type === 'dhcpv6' ?
            <DHCPv6Form
                formData={formData.wan6_dhcpv6}
                errors={errors.wan6_dhcpv6}
                disabled={props.disabled}
                last_seen_duid={last_seen_duid}

                setFormValue={props.setFormValue}
            />
            : wan6Type === 'static' ?
                <StaticForm
                    formData={formData.wan6_static}
                    errors={errors.wan6_static}
                    disabled={props.disabled}

                    setFormValue={props.setFormValue}
                />
                : wan6Type === '6to4' ?
                    <_6to4Form
                        formData={formData.wan6_6to4}
                        errors={errors.wan6_6to4}
                        disabled={props.disabled}

                        setFormValue={props.setFormValue}
                    />
                    : wan6Type === '6in4' ?
                        <_6in4Form
                            formData={formData.wan6_6in4}
                            errors={errors.wan6_6in4}
                            disabled={props.disabled}

                            setFormValue={props.setFormValue}
                        />
                        : null}
    </>

}

function DHCPv6Form(props) {
    const errors = (props.errors || {});
    return <TextInput
        label={_('Custom DUID')}
        value={props.formData.duid || ''}
        disabled={props.disabled}
        error={errors.duid || null}
        helpText={HELP_TEXTS.dhcpv6.duid}
        placeholder={props.last_seen_duid}

        onChange={props.setFormValue(
            value => ({wan6_settings: {wan6_dhcpv6: {duid: {$set: value}}}})
        )}
    />
}

function StaticForm(props) {
    const errors = (props.errors || {});
    return <>
        <TextInput
            label={_('Address')}
            value={props.formData.ip || ''}
            helpText={HELP_TEXTS.static.ip}
            disabled={props.disabled}
            error={errors.ip || null}
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_static: {ip: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('Gateway')}
            value={props.formData.gateway || ''}
            disabled={props.disabled}
            error={errors.gateway || null}
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_static: {gateway: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('Prefix')}
            value={props.formData.network || ''}
            helpText={HELP_TEXTS.static.network}
            disabled={props.disabled}
            error={errors.network || null}
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_static: {network: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('DNS server 1')}
            value={props.formData.dns1 || ''}
            disabled={props.disabled}
            error={errors.dns1 || null}
            helpText={HELP_TEXTS.static.dns}

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_static: {dns1: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('DNS server 2')}
            value={props.formData.dns2 || ''}
            disabled={props.disabled}
            error={errors.dns2 || null}
            helpText={HELP_TEXTS.static.dns}

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_static: {dns2: {$set: value}}}})
            )}
        />
    </>
}

function _6to4Form(props) {
    const errors = (props.errors || {});

    return <TextInput
        label={_('Public IPv4')}
        value={props.formData.ipv4_address || ''}
        disabled={props.disabled}
        helpText={HELP_TEXTS['6to4'].ipv4_address}
        error={errors.ipv4_address || null}
        required

        onChange={props.setFormValue(
            value => ({wan6_settings: {wan6_6to4: {ipv4_address: {$set: value}}}})
        )}
    />
}

function _6in4Form(props) {
    const errors = (props.errors || {});

    return <>
        <TextInput
            label={_('Provider IPv4')}
            value={props.formData.server_ipv4 || ''}
            disabled={props.disabled}
            helpText={HELP_TEXTS['6in4'].server_ipv4}
            error={errors.server_ipv4 || null}
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_6in4: {server_ipv4: {$set: value}}}})
            )}
        />
        <TextInput
            label={_('Routed IPv6 prefix')}
            value={props.formData.ipv6_prefix || ''}
            disabled={props.disabled}
            helpText={HELP_TEXTS['6in4'].ipv6_prefix}
            error={errors.ipv6_prefix || null}
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_6in4: {ipv6_prefix: {$set: value}}}})
            )}
        />
        <NumberInput
            label={_('MTU')}
            value={props.formData.mtu || ''}
            disabled={props.disabled}
            error={errors.mtu || null}
            min='1280'
            max='1500'
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_6in4: {mtu: {$set: value}}}})
            )}
        />
        <CheckBox
            label='Dynamic IPv4 handling'
            checked={props.formData.dynamic_ipv4.enabled || false}
            helpText={HELP_TEXTS['6in4'].dynamic_ipv4.enabled}
            disabled={props.disabled}

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_6in4: {dynamic_ipv4: {enabled: {$set: value}}}}})
            )}
        />
        {props.formData.dynamic_ipv4.enabled ?
            <DynamicIPv4Form
                formData={props.formData.dynamic_ipv4}
                errors={errors.dynamic_ipv4}
                disabled={props.disabled}

                setFormValue={props.setFormValue}
            />
            : null
        }
    </>;
}

function DynamicIPv4Form(props) {
    const errors = (props.errors || {});

    return <>
        <TextInput
            label={_('Tunnel ID')}
            value={props.formData.tunnel_id || ''}
            disabled={props.disabled}
            helpText={HELP_TEXTS['6in4'].dynamic_ipv4.tunnel_id}
            error={errors.tunnel_id || null}
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_6in4: {dynamic_ipv4: {tunnel_id: {$set: value}}}}})
            )}
        />
        <TextInput
            label={_('Username')}
            value={props.formData.username || ''}
            disabled={props.disabled}
            helpText={HELP_TEXTS['6in4'].dynamic_ipv4.username}
            error={errors.username || null}
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_6in4: {dynamic_ipv4: {username: {$set: value}}}}})
            )}
        />
        <TextInput
            label={_('Key')}
            value={props.formData.password_or_key || ''}
            disabled={props.disabled}
            helpText={HELP_TEXTS['6in4'].dynamic_ipv4.password_or_key}
            error={errors.password_or_key || null}
            required

            onChange={props.setFormValue(
                value => ({wan6_settings: {wan6_6in4: {dynamic_ipv4: {password_or_key: {$set: value}}}}})
            )}
        />
    </>;
}

export function validateWAN6Form(formData) {
    let errors = {};
    switch (formData.wan6_type) {
        case 'dhcpv6':
            errors.wan6_dhcpv6 = validateDHCPv6Form(formData.wan6_dhcpv6);
            break;
        case 'static':
            errors.wan6_static = validateStaticForm(formData.wan6_static);
            break;
        case '6to4':
            errors.wan6_6to4 = validate6to4Form(formData.wan6_6to4);
            break;
        case '6in4':
            errors.wan6_6in4 = validate6in4Form(formData.wan6_6in4);
            break;
    }
    return errors['wan6_' + formData.wan6_type] ? errors : null;
}


function validateDHCPv6Form(wan6_dhcpv6) {
    const error = {duid: validateDUID(wan6_dhcpv6.duid)};
    return error.duid ? error : null;
}

function validateStaticForm(wan6_static) {
    let errors = {};
    ['ip', 'network'].forEach(
        field => {
            let error = validateIPv6Prefix(wan6_static[field]);
            if (error)
                errors[field] = error;
        }
    );
    ['gateway', 'dns1', 'dns2'].forEach(
        field => {
            let error = validateIPv6Address(wan6_static[field]);
            if (error)
                errors[field] = error;
        }
    );
    ['ip', 'network', 'gateway'].forEach(
        field => {
            if (!wan6_static[field] || wan6_static[field] === '')
                errors[field] = _('This field is required.');
        }
    );

    return JSON.stringify(errors) !== '{}' ? errors : null;
}

function validate6to4Form(wan6_6to4) {
    let error;
    if (!wan6_6to4.ipv4_address || wan6_6to4.ipv4_address === '')
        error = _('Public IPv4 address is required.');
    else
        error = validateIPv4Address(wan6_6to4.ipv4_address);
    return error ? {ipv4_address: error} : null;
}

function validate6in4Form(wan6_6in4) {
    let errors = {
        server_ipv4: validateIPv4Address(wan6_6in4.server_ipv4),
        ipv6_prefix: validateIPv6Prefix(wan6_6in4.ipv6_prefix),
        dynamic_ipv4: validateDynamicIPv4Form(wan6_6in4.dynamic_ipv4),
    };

    if (!errors.server_ipv4 && !errors.ipv6_prefix && !errors.dynamic_ipv4)
        errors = {};

    const mtu = parseInt(wan6_6in4.mtu);
    if (isNaN(mtu))
        errors.mtu = _('MTU should be a number in range of 1280-1500.');
    else if (!(1280 <= mtu && mtu <= 1500))
        errors.mtu = _('MTU should be in range of 1280-1500.');

    ['mtu', 'server_ipv4', 'ipv6_prefix', 'dynamic_ipv4'].forEach(
        field => {
            if (!wan6_6in4[field] || wan6_6in4[field] === '')
                errors[field] = _('This field is required.');
        }
    );

    return JSON.stringify(errors) !== '{}' ? errors : null;
}

function validateDynamicIPv4Form(dynamic_ipv4) {
    if (!dynamic_ipv4.enabled)
        return null;

    let errors = {};
    ['tunnel_id', 'username', 'password_or_key'].forEach(
        field => {
            if (!dynamic_ipv4[field] || dynamic_ipv4[field] === '')
                errors[field] = _('This field is required.');
        }
    );
    return JSON.stringify(errors) !== '{}' ? errors : null;
}
