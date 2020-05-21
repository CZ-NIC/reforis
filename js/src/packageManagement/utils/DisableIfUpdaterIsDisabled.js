/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import DisabledUpdaterAlert from "./DisabledUpdaterAlert";

DisableIfUpdaterIsDisabled.propTypes = {
    formData: PropTypes.shape({ enabled: PropTypes.bool }),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default function DisableIfUpdaterIsDisabled({ children, formData, ...props }) {
    const isDisabled = !formData.enabled;
    const childrenWithFormProps = React.Children.map(
        children,
        (child) => React.cloneElement(child, { ...props, formData, disabled: isDisabled }),
    );

    if (!isDisabled) return childrenWithFormProps;

    return (
        <>
            <DisabledUpdaterAlert />
            <div className="text-muted">
                {childrenWithFormProps}
            </div>
        </>
    );
}
