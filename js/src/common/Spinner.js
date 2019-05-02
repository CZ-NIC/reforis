/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

Spinner.propTypes = {
    children: propTypes.oneOfType([
        propTypes.arrayOf(propTypes.node),
        propTypes.node
    ]).isRequired
};

export default function Spinner({children}) {
    return <div className="spinner-wrapper">
        <div className="spinner-background">
            <div className="spinner-text">{children}</div>
            <div className="spinner-border" role="status">
                <span className="sr-only"/>
            </div>
        </div>
    </div>;
}