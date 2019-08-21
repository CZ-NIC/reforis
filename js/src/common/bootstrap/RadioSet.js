/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid/dist/es5/index";

import { formFieldsSize } from "./constants";


RadioSet.propTypes = {
    /** Name attribute of the input HTML tag. */
    name: PropTypes.string.isRequired,
    /** RadioSet label . */
    label: PropTypes.string,
    /** Choices . */
    choices: PropTypes.arrayOf(PropTypes.shape({
        /** Choice lable . */
        label: PropTypes.string.isRequired,
        /** Choice value . */
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })).isRequired,
    /** Initial value . */
    value: PropTypes.string,
    /** Help text message . */
    helpText: PropTypes.string,
};

export default function RadioSet({
    name, label, choices, value, helpText, ...props
}) {
    const uid = useUID();
    const radios = choices.map((choice, key) => (
        <Radio
            id={`${name}-${key}`}
            key={key}
            name={name}
            label={choice.label}
            value={choice.value}
            helpText={choice.helpText}
            checked={choice.value === value}

            {...props}
        />
    ));

    return (
        <div className={`form-group ${formFieldsSize}`} style={{ marginBottom: "1rem" }}>
            {label
                ? (
                    <label className="col-12" htmlFor={uid} style={{ paddingLeft: "0" }}>
                        {label}
                    </label>
                )
                : null}
            {radios}
            {helpText ? <small className="form-text text-muted">{helpText}</small> : null}
        </div>
    );
}

Radio.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    helpText: PropTypes.string,
};

function Radio({
    label, id, helpText, ...props
}) {
    return (
        <>
            <div className="custom-control custom-radio custom-control-inline">
                <input
                    id={id}
                    className="custom-control-input"
                    type="radio"

                    {...props}
                />
                <label className="custom-control-label" htmlFor={id}>{label}</label>
            </div>
            {helpText ? <small className="form-text text-muted">{helpText}</small> : null}
        </>
    );
}
