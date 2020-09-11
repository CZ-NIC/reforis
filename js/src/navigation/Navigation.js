/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { matchPath, withRouter } from "react-router-dom";
import { Portal } from "foris";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { NavigationToggle, NavigationToggleItem } from "./NavigationToggle";
import NavigationMainItem from "./NavigationMainItem";

Navigation.propTypes = {
    pages: PropTypes.arrayOf(PropTypes.object),
    location: PropTypes.object.isRequired,
};

function Navigation({ pages, location }) {
    const navigationContent = pages.map((page) => {
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

    return (
        <SimpleBar>
            <Portal containerId="navigation-collapse-toggle">
                <button
                    type="button"
                    className="btn btn-lg btn-primary"
                    data-toggle="collapse"
                    data-target="#navigation-container-collapse"
                    aria-expanded="false"
                    aria-controls="navigation-container-collapse"
                >
                    <i className="fas fa-bars" />
                </button>
            </Portal>
            <div id="navigation-container-collapse" className="collapse">
                <ul className="list-unstyled">{navigationContent}</ul>
            </div>
        </SimpleBar>
    );
}

const NavigationWithRouter = withRouter(Navigation);
export default NavigationWithRouter;
