/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Portal } from "foris";

import "./ErrorBoundary.css";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        // eslint-disable-next-line no-console
        console.error(
            `An error ocurred in reForis: "${error}", see details below.`,
            errorInfo.componentStack
        );
    }

    render() {
        const { error } = this.state;
        if (error) {
            document.title = "An Error Occurred - reForis";
            return (
                <Portal containerId="content-container">
                    <h1>{_("An Error Occurred")}</h1>
                    <code className="error-boundary-description p-3 my-3">
                        {error.toString()}
                    </code>
                    <p>
                        {_(
                            "More detailed information is available in the console of your web browser - on most browsers accessible after pressing Ctrl+Shift+J or F12."
                        )}
                    </p>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: _(
                                'Please report this error to our support team via e-mail: <a href="mailto:tech.support@turris.cz">tech.support@turris.cz</a>.'
                            ),
                        }}
                    />
                </Portal>
            );
        }

        // eslint-disable-next-line react/destructuring-assignment
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
