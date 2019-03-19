/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


import React from 'react';
import {LABEL_SIZE, FIELD_SIZE} from "./constants";


export default function Password({name, id, label, onChange, value, error, ...props}) {
    return <div className="form-group row">
        <label className={"form-control-label col-sm-" + LABEL_SIZE} htmlFor={id}>{label}</label>
        <div className={"col-sm-" + FIELD_SIZE}>
            <input
                className={"form-control " + (!error ? "" : "is-invalid")}
                type="password"
                name={name}
                id={id}
                onChange={onChange}
                value={value}
                {...props}
            />
            <div className="invalid-feedback">{error}</div>
        </div>
    </div>;
}