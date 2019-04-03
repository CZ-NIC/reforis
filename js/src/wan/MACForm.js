/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import CheckBox from "../bootstrap/Checkbox";
import TextInput from "../bootstrap/TextInput";
import {validateMAC} from "../settingsHelpers/validation";

const HELP_TEXTS = {
    custom_mac_enabled: _('Useful in cases, when a specific MAC address is required by your internet service provider.'),
    custom_mac: _('Colon is used as a separator, for example 00:11:22:33:44:55'),
};

export default class MACForm extends React.PureComponent {
    static validate(formData) {
        if (formData.custom_mac_enabled && (!formData.custom_mac || formData.custom_mac === ''))
            return {custom_mac: _("This field is required.")};

        const error = {custom_mac: validateMAC(formData.custom_mac)};
        return error.custom_mac ? error : null;
    }

    render() {
        const errors = this.props.errors ? this.props.errors : {};
        return (
            <>
                <CheckBox
                    label={_('Custom MAC address')}
                    checked={this.props.formData.custom_mac_enabled}
                    helpText={HELP_TEXTS.custom_mac_enabled}
                    disabled={this.props.disabled}

                    onChange={this.props.changeFormData(
                        value => ({mac_settings: {custom_mac_enabled: {$set: value}}})
                    )}
                />
                {this.props.formData.custom_mac_enabled ?
                    <TextInput
                        label={_('MAC address')}
                        value={this.props.formData.custom_mac || ''}
                        helpText={HELP_TEXTS.custom_mac}
                        error={errors.custom_mac}
                        disabled={this.props.disabled}

                        required
                        onChange={this.props.changeFormData(
                            value => ({mac_settings: {custom_mac: {$set: value}}})
                        )}
                    />
                    : null}
            </>
        );
    }
}