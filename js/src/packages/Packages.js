/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

import {APIEndpoints} from '../common/API';
import Alert from '../common/bootstrap/Alert';
import ForisForm from '../formContainer/ForisForm';

import LanguageForm from './LanguageForm';
import PackagesForm from './PackagesForm';

export default function Packages() {
    return <ForisForm
        forisConfig={{endpoint: APIEndpoints.packages}}
        prepData={prepData}
        prepDataToSubmit={prepDataToSubmit}
        // Disable form if updater is disabled
        disable={formData => !formData.enabled}
    >
        <DisabledUpdaterAlert/>
        <PackagesForm/>
        <LanguageForm/>
    </ForisForm>
}

DisabledUpdaterAlert.propTypes = {
    formData: propTypes.shape({enabled: propTypes.bool.isRequired})
};

function DisabledUpdaterAlert({formData}) {
    return formData.enabled ? null : <Alert
        type='warning'
        message={_('Please enable automatic updates to manage packages and languages.')}
    />
}

function prepData(formData) {
    formData.user_lists = formData.user_lists
        .filter(_package => !_package.hidden);
    return formData
}

function prepDataToSubmit(formData) {
    const packages = formData.user_lists
        .filter(_package => _package.enabled)
        .map(_package => _package.name);

    const languages = formData.languages
        .filter(language => language.enabled)
        .map(language => language.code);

    return {languages: languages, user_lists: packages}
}
