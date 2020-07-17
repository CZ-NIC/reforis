/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

DismissAllButton.propTypes = {
    dismissAll: PropTypes.func.isRequired,
};

export default function DismissAllButton({ dismissAll }) {
    return (
        <button
            type="button"
            id="btn-dismiss-all"
            className="btn btn-outline-danger mt-2 float-right"
            onClick={dismissAll}
            title={_("Dismiss all")}
        >
            <i className="fas fa-trash" />
            {" "}{_("Dismiss all")}
        </button>
    );
}
