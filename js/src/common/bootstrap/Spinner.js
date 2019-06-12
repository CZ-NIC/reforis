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
    ]),
    fullScreen: propTypes.bool.isRequired,
};

Spinner.defaultProps = {
    fullScreen: false,
};

export default function Spinner({fullScreen, children, className, ...props}) {
    if (!fullScreen) {
        return <div className={'spinner-wrapper ' + (className ? className : '')} {...props}>
            <SpinnerElement>{children}</SpinnerElement>
        </div>;
    }

    return <div className="spinner-fs-wrapper" {...props}>
        <div className="spinner-fs-background">
            <SpinnerElement>{children}</SpinnerElement>
        </div>
    </div>
}

export function SpinnerElement({small, children}) {
    return <>
        <div className={'spinner-border ' + (small ? 'spinner-border-sm' : '')} role="status">
            <span className="sr-only"/>
        </div>
        <div className="spinner-text">{children}</div>
    </>
}
