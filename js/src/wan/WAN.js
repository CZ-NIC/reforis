/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import update from 'immutability-helper';

import withSettingsForm from "../settingsHelpers/withSettingsForm";
import WANForm from "./WANForm";
import WAN6Form from "./WAN6Form";
import MACForm from "./MACForm";

class WANBase extends React.Component {
    render() {
        if (!this.props.formData)
            return null;

        return <>
            <h3>{_('WAN IPv4')}</h3>
            <WANForm
                formData={this.props.formData.wan_settings}
                errors={(this.props.formErrors || {}).wan_settings || {}}
                disabled={this.props.formIsDisabled}


                setFormData={this.props.setFormData}
                changeFormData={this.props.changeFormData}
            />

            <h3>{_('WAN IPv6')}</h3>
            <WAN6Form
                formData={this.props.formData.wan6_settings}
                last_seen_duid={this.props.formData.last_seen_duid}
                errors={(this.props.formErrors || {}).wan6_settings || {}}
                disabled={this.props.formIsDisabled}

                setFormData={this.props.setFormData}
                changeFormData={this.props.changeFormData}
            />

            <h3>{_('MAC')}</h3>
            <MACForm
                formData={this.props.formData.mac_settings}
                errors={(this.props.formErrors || {}).mac_settings || {}}
                disabled={this.props.formIsDisabled}

                setFormData={this.props.setFormData}
                changeFormData={this.props.changeFormData}
            />
        </>
    }
}

function prepData(data) {
    // Create empty form fields if nothing has got from the server.
    const wan6_6in4 = update((data.wan6_settings || {}).wan6_6in4 || {}, {
        dynamic_ipv4: {
            $set: ((data.wan6_settings || {}).wan6_6in4 || {}).dynamic_ipv4 || {enabled: false}
        },
    });
    return update(data, {
        wan_settings: {
            wan_dhcp: {$set: data.wan_settings.wan_dhcp || {}},
            wan_static: {$set: data.wan_settings.wan_static || {}},
            wan_pppoe: {$set: data.wan_settings.wan_pppoe || {}}
        },
        wan6_settings: {
            wan6_dhcpv6: {$set: data.wan6_settings.wan6_dhcpv6 || {duid: ""}},
            wan6_static: {$set: data.wan6_settings.wan6_static || {}},
            wan6_6to4: {$set: data.wan6_settings.wan6_6to4 || {}},
            wan6_6in4: {$set: wan6_6in4},
        }
    })
}


function prepDataToSubmit(formData) {
    const dataToSubmit = {
        wan_settings: deleteUnnecessarySettings(formData.wan_settings.wan_type, formData.wan_settings),
        wan6_settings: deleteUnnecessarySettings(formData.wan6_settings.wan6_type, formData.wan6_settings),
        mac_settings: formData.mac_settings,
    };

    if (formData.wan6_settings.wan6_type === '6in4' && !formData.wan6_settings.wan6_6in4.dynamic_ipv4.enabled)
        formData.wan6_settings.wan6_6in4.dynamic_ipv4 = {enabled: false};

    if (!formData.mac_settings.custom_mac_enabled)
        delete dataToSubmit.mac_settings.custom_mac;

    return dataToSubmit;
}

function deleteUnnecessarySettings(type, settings) {
    for (let key in settings) {
        if (!settings.hasOwnProperty(key) || key.endsWith('type'))
            continue;
        if (!key.endsWith(type))
            delete settings[key]
    }
    return settings
}

function validator(formData) {
    const errors = {
        wan_settings: WANForm.validate(formData.wan_settings),
        wan6_settings: WAN6Form.validate(formData.wan6_settings),
        mac_settings: MACForm.validate(formData.mac_settings)
    };
    if (errors.wan_settings || errors.wan6_settings || errors.mac_settings)
        return errors;
    return {}
}

const WAN = withSettingsForm('wan', prepData, prepDataToSubmit, validator)(WANBase);

export default WAN;
