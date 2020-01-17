/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { matchPath, withRouter } from "react-router-dom";

import { NavigationToggle, NavigationToggleItem } from "./NavigationToggle";
import NavigationMainItem from "./NavigationMainItem";

Navigation.propTypes = {
    pages: PropTypes.arrayOf(PropTypes.object),
    location: PropTypes.object.isRequired,
};

function Navigation({ pages, location }) {
    return pages.map((page) => {
        if (page.isHidden) return null;

        if (page.pages) {
            const active = matchPath(location.pathname, {
                path: page.path,
                strict: true,
            });
            return (
                <NavigationToggle key={page.name} active={!!active} {...page}>
                    {page.pages.map((subPage) => (
                        <NavigationToggleItem
                            key={subPage.name}
                            {...subPage}
                            path={`${page.path}${subPage.path}`}
                        />
                    ))}
                </NavigationToggle>
            );
        }

        return <NavigationMainItem key={page.name} {...page} />;
    });
}

const NavigationWithRouter = withRouter(Navigation);
export default NavigationWithRouter;
