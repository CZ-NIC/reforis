/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import UserOptions from "./UserOptions/UserOptions";
import PackageCheckBox from "./PackageCheckBox";

Package.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    labels: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    url: PropTypes.string,
    setFormValue: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function Package({
    title,
    description,
    enabled,
    labels,
    options,
    index,
    url,
    setFormValue,
    disabled,
}) {
    return (
        <div className="package" key={title}>
            <PackageCheckBox
                name={title}
                labels={labels}
                helpText={description}
                checked={enabled}
                disabled={disabled}
                url={url}
                onChange={setFormValue((value) => ({
                    package_lists: { [index]: { enabled: { $set: value } } },
                }))}
            />
            {options && options.length > 0 ? (
                <UserOptions
                    packageIndex={index}
                    options={options}
                    setFormValue={setFormValue}
                    disabled={disabled || !enabled}
                />
            ) : null}
        </div>
    );
}
