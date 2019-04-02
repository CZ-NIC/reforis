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
    componentDidMount() {
        this.props.setFormData(
            update(this.props.formData, {
                wan_settings: {
                    wan_dhcp: {$set: this.props.formData.wan_settings.wan_dhcp || {}},
                    wan_static: {$set: this.props.formData.wan_settings.wan_static || {}},
                    wan_pppoe: {$set: this.props.formData.wan_settings.wan_pppoe || {}}
                }
            })
        );
    }

    render() {
        if (!this.props.formData)
            return null;

        return <>
            <h3>{_('WAN IPv4')}</h3>
            <WANForm
                formData={this.props.formData.wan_settings}
                errors={(this.props.formErrors || {}).wan_settings || {}}

                setFormData={this.props.setFormData}
                changeFormData={this.props.changeFormData}
            />

            <h3>{_('WAN IPv6')}</h3>
            <WAN6Form
                {...this.props.formData.wan6_settings}
                changeFormData={this.props.changeFormData}
            />

            <h3>{_('MAC')}</h3>
            <MACForm
                {...this.props.formData.mac_settings}
                changeFormData={this.props.changeFormData}
            />
        </>
    }
}


const validator = formData => {
    const errors = {
        wan_settings: WANForm.validateWAN(formData.wan_settings)
    };
    if (errors.wan_settings || errors.wan6_settings || errors.mac_settings)
        return errors;
    return {}
};

const prepDataToSubmit = formData => {
    return formData
};

const WAN = withSettingsForm('wan', prepDataToSubmit, validator)(WANBase);

export default WAN;
