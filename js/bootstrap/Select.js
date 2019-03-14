/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {LABEL_SIZE, FIELD_SIZE} from "./constants";


export default function Select({name, id, label, choices, value, onChange, ...props}) {
    const options = choices.map((choice, key) => {
        return <option key={key} value={choice.value}>{choice.label}</option>;
    });

    return <div className="form-group row">
        <label className={"form-control-label col-sm-" + LABEL_SIZE} htmlFor={id}>{label}</label>
        <div className={"col-sm-" + FIELD_SIZE}>
            <select
                className="form-control"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                {...props}
            >
                {options}
            </select>
        </div>
    </div>;
}


