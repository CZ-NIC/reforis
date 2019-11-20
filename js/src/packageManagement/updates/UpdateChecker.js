/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Button } from "foris";
import { useCheckUpdates, usePendingPolling } from "./hooks";

UpdateChecker.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    setPending: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default function UpdateChecker({
    onSuccess, pending, setPending, children,
}) {
    usePendingPolling(onSuccess, pending, setPending);
    const refreshUpdates = useCheckUpdates(setPending);

    return (
        <Button
            className="btn-primary mb-3"
            forisFormSize
            onClick={refreshUpdates}
            disabled={pending}
        >
            {children}
        </Button>
    );
}
