/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {REFORIS_PREFIX} from '../common/constants';
import {Link, NavLink} from 'react-router-dom';
import React, {useContext} from 'react';
import {outsideReactRoutingContext} from './Main';

export function ForisLink({...props}) {
    return <ForisBaseLink LinkComponent={Link}  {...props}/>
}

export function ForisNavLink({...props}) {
    return <ForisBaseLink LinkComponent={NavLink}  {...props}/>
}

function ForisBaseLink({to, search, isLinkOutside, children, LinkComponent, ...props}) {
    const outsideReactRouting = useContext(outsideReactRoutingContext);

    if (outsideReactRouting || isLinkOutside) {
        const path = `${isLinkOutside ? '' : REFORIS_PREFIX}${to}${!!search ? search : ''}`;
        return <a href={path} {...props}> {children}</a>;
    }

    return <LinkComponent
        to={{
            pathname: to,
            search: search
        }}
        {...props}
    >
        {children}
    </LinkComponent>
}
