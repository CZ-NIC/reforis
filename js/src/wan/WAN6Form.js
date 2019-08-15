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
import CheckBox from 'common/bootstrap/Checkbox';
import NumberInput from 'common/bootstrap/NumberInput';
import {
    validateDUID,
    validateIPv4Address,
    validateIPv6Address,
    validateIPv6Prefix
} from 'common/validations';

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

const FIELDS_PROP_TYPES = {
    last_seen_duid: PropTypes.string,
    wan6_dhcpv6: PropTypes.object,
    wan6_static: PropTypes.object,
    wan6_6to4: PropTypes.object,
    wan6_6in4: PropTypes.object,
};

WAN6Form.propTypes = {
    formData: PropTypes.shape({
            wan6_settings: PropTypes.shape({
                wan6_type: PropTypes.string.isRequired,
                ...FIELDS_PROP_TYPES
            })
        }
    ).isRequired,
    formErrors: PropTypes.shape(FIELDS_PROP_TYPES),
    setFormValue: PropTypes.func.isRequired,
};

WAN6Form.defaultProps = {
    setFormValue: () => {
    },
    formData: {},
};

export default function WAN6Form({formData, formErrors, setFormValue, ...props}) {
    const wan6Settings = formData.wan6_settings;
    const wan6Type = wan6Settings.wan6_type;
    const last_seen_duid = wan6Settings.last_seen_duid;
    const errors = (formErrors || {}).wan6_settings || {};

    return <>
        <h3>{_('WAN IPv6')}</h3>
        <Select
            label={_('IPv6 protocol')}
            value={wan6Type}
            choices={WAN6_CHOICES}

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_type: {$set: value}}})
            )}

            {...props}
        />
        {wan6Type === 'dhcpv6' ?
            <DHCPv6Form
                formData={wan6Settings.wan6_dhcpv6}
                formErrors={errors.wan6_dhcpv6}
                last_seen_duid={last_seen_duid}

                {...props}

                setFormValue={setFormValue}
            />
            : wan6Type === 'static' ?
                <StaticForm
                    formData={wan6Settings.wan6_static}
                    formErrors={errors.wan6_static}

                    setFormValue={setFormValue}

                    {...props}
                />
                : wan6Type === '6to4' ?
                    // eslint-disable-next-line react/jsx-pascal-case
                    <_6to4Form
                        formData={wan6Settings.wan6_6to4}
                        formErrors={errors.wan6_6to4}

                        setFormValue={setFormValue}

                        {...props}
                    />
                    : wan6Type === '6in4' ?
                        // eslint-disable-next-line react/jsx-pascal-case
                        <_6in4Form
                            formData={wan6Settings.wan6_6in4}
                            formErrors={errors.wan6_6in4}

                            setFormValue={setFormValue}

                            {...props}
                        />
                        : null}
    </>

}

DHCPv6Form.propTypes = {
    last_seen_duid: PropTypes.string,
    formData: PropTypes.shape({duid: PropTypes.string}).isRequired,
    formErrors: PropTypes.shape({duid: PropTypes.string}),
    setFormValue: PropTypes.func.isRequired,
};

DHCPv6Form.defaultProps = {
    formErrors: {},
};

function DHCPv6Form({formData, last_seen_duid, formErrors, setFormValue, ...props}) {
    return <TextInput
        label={_('Custom DUID')}
        value={formData.duid || ''}
        error={formErrors.duid || null}
        helpText={HELP_TEXTS.dhcpv6.duid}
        placeholder={last_seen_duid}

        onChange={setFormValue(
            value => ({wan6_settings: {wan6_dhcpv6: {duid: {$set: value}}}})
        )}

        {...props}
    />
}

const STATIC_FIELDS_PROPS_TYPES = {
    ip: PropTypes.string,
    gateway: PropTypes.string,
    network: PropTypes.string,
    dns1: PropTypes.string,
    dns2: PropTypes.string,
};

StaticForm.propTypes = {
    formData: PropTypes.shape(STATIC_FIELDS_PROPS_TYPES).isRequired,
    formErrors: PropTypes.shape(STATIC_FIELDS_PROPS_TYPES),
    setFormValue: PropTypes.func.isRequired,
};

StaticForm.defaultProps = {
    formErrors: {},
};

function StaticForm({formData, formErrors, setFormValue, ...props}) {
    return <>
        <TextInput
            label={_('Address')}
            value={formData.ip || ''}
            helpText={HELP_TEXTS.static.ip}
            error={formErrors.ip || null}
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_static: {ip: {$set: value}}}})
            )}

            {...props}
        />
        <TextInput
            label={_('Gateway')}
            value={formData.gateway || ''}
            error={formErrors.gateway || null}
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_static: {gateway: {$set: value}}}})
            )}

            {...props}
        />
        <TextInput
            label={_('Prefix')}
            value={formData.network || ''}
            helpText={HELP_TEXTS.static.network}
            error={formErrors.network || null}
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_static: {network: {$set: value}}}})
            )}

            {...props}
        />
        <TextInput
            label={_('DNS server 1')}
            value={formData.dns1 || ''}
            error={formErrors.dns1 || null}
            helpText={HELP_TEXTS.static.dns}

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_static: {dns1: {$set: value}}}})
            )}

            {...props}
        />
        <TextInput
            label={_('DNS server 2')}
            value={formData.dns2 || ''}
            error={formErrors.dns2 || null}
            helpText={HELP_TEXTS.static.dns}

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_static: {dns2: {$set: value}}}})
            )}

            {...props}
        />
    </>
}

_6to4Form.propTypes = {
    formData: PropTypes.shape({ipv4_address: PropTypes.string}).isRequired,
    formErrors: PropTypes.shape({ipv4_address: PropTypes.string}),
    setFormValue: PropTypes.func.isRequired,
};

_6to4Form.defaultProps = {
    formErrors: {},
};

function _6to4Form({formData, formErrors, setFormValue, ...props}) {
    return <TextInput
        label={_('Public IPv4')}
        value={formData.ipv4_address || ''}
        helpText={HELP_TEXTS['6to4'].ipv4_address}
        error={formErrors.ipv4_address || null}
        required

        onChange={setFormValue(
            value => ({wan6_settings: {wan6_6to4: {ipv4_address: {$set: value}}}})
        )}

        {...props}
    />
}

const _6IN4_FIELDS_PROPS_TYPES = {
    server_ipv4: PropTypes.string,
    ipv6_prefix: PropTypes.string,
    mtu: PropTypes.string,
    dns1: PropTypes.string,
    dns2: PropTypes.string,
    dynamic_ipv4: PropTypes.shape({enabled: PropTypes.bool}),
};

_6in4Form.propTypes = {
    formData: PropTypes.shape(_6IN4_FIELDS_PROPS_TYPES).isRequired,
    formErrors: PropTypes.shape(_6IN4_FIELDS_PROPS_TYPES),
};

_6in4Form.defaultProps = {
    formErrors: {},
};

function _6in4Form({formData, formErrors, setFormValue, ...props}) {
    return <>
        <TextInput
            label={_('Provider IPv4')}
            value={formData.server_ipv4 || ''}
            helpText={HELP_TEXTS['6in4'].server_ipv4}
            error={formErrors.server_ipv4 || null}
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_6in4: {server_ipv4: {$set: value}}}})
            )}

            {...props}
        />
        <TextInput
            label={_('Routed IPv6 prefix')}
            value={formData.ipv6_prefix || ''}
            helpText={HELP_TEXTS['6in4'].ipv6_prefix}
            error={formErrors.ipv6_prefix || null}
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_6in4: {ipv6_prefix: {$set: value}}}})
            )}

            {...props}
        />
        <NumberInput
            label={_('MTU')}
            value={formData.mtu || ''}
            error={formErrors.mtu || null}
            min='1280'
            max='1500'
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_6in4: {mtu: {$set: value}}}})
            )}

            {...props}
        />
        <CheckBox
            label='Dynamic IPv4 handling'
            checked={formData.dynamic_ipv4.enabled || false}
            helpText={HELP_TEXTS['6in4'].dynamic_ipv4.enabled}

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_6in4: {dynamic_ipv4: {enabled: {$set: value}}}}})
            )}

            {...props}
        />
        {formData.dynamic_ipv4.enabled ?
            <DynamicIPv4Form
                formData={formData.dynamic_ipv4}
                formErrors={formErrors.dynamic_ipv4}

                setFormValue={setFormValue}

                {...props}
            />
            : null
        }
    </>;
}

const _6IN4_DYNAMIC_IPv4_FIELDS_PROPS_TYPES = {
    tunnel_id: PropTypes.string,
    username: PropTypes.string,
    password_or_key: PropTypes.string,
};

DynamicIPv4Form.propTypes = {
    formData: PropTypes.shape(_6IN4_DYNAMIC_IPv4_FIELDS_PROPS_TYPES).isRequired,
    formErrors: PropTypes.shape(_6IN4_DYNAMIC_IPv4_FIELDS_PROPS_TYPES),
    setFormValue: PropTypes.func.isRequired,
};


DynamicIPv4Form.defaultProps = {
    formErrors: {}
};

function DynamicIPv4Form({formData, formErrors, setFormValue, ...props}) {
    return <>
        <TextInput
            label={_('Tunnel ID')}
            value={formData.tunnel_id || ''}
            helpText={HELP_TEXTS['6in4'].dynamic_ipv4.tunnel_id}
            error={formErrors.tunnel_id || null}
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_6in4: {dynamic_ipv4: {tunnel_id: {$set: value}}}}})
            )}

            {...props}
        />
        <TextInput
            label={_('Username')}
            value={formData.username || ''}
            helpText={HELP_TEXTS['6in4'].dynamic_ipv4.username}
            error={formErrors.username || null}
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_6in4: {dynamic_ipv4: {username: {$set: value}}}}})
            )}

            {...props}
        />
        <TextInput
            label={_('Key')}
            value={formData.password_or_key || ''}
            helpText={HELP_TEXTS['6in4'].dynamic_ipv4.password_or_key}
            error={formErrors.password_or_key || null}
            required

            onChange={setFormValue(
                value => ({wan6_settings: {wan6_6in4: {dynamic_ipv4: {password_or_key: {$set: value}}}}})
            )}

            {...props}
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
        default:
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
