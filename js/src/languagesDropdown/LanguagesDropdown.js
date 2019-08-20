/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {SpinnerElement} from 'common/bootstrap/Spinner';
import {useAPIPost} from 'common/APIhooks';
import API_URLs from 'common/API';

import {useLanguages, useWSSetLanguageRefresh} from './hooks';

LanguagesDropdown.propTypes = {
    ws: PropTypes.object.isRequired
};

export default function LanguagesDropdown({ws}) {
    const [currentLang, langsList] = useLanguages();
    useWSSetLanguageRefresh(ws);

    const [, post] = useAPIPost(API_URLs.language);


    return <div className="dropdown">
        <button className="nav-item btn btn-link" type="button">
            {currentLang ? currentLang : <SpinnerElement small/>}
        </button>

        <div className="dropdown-menu" id="languages-dropdown-menu">
            <div className="dropdown-header">
                <h5>Languages</h5>
            </div>
            <div className="dropdown-divider"></div>
            {langsList ?
                langsList.map(lang =>
                    <button
                        key={lang}
                        className="dropdown-item"
                        onClick={() => post({language: lang})}
                    >
                        {lang}
                    </button>
                )
                : <SpinnerElement small/>}
        </div>
    </div>
}
