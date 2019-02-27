/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {LABEL_SIZE} from "./constants";

export default function CheckBox({name, id, label, onChange, checked = false}) {
    return <div className="form-group row">
        <div className={"form-label col-sm-" + LABEL_SIZE}>
            <label className="form-label" htmlFor={id}>{label}</label>
        </div>
        <div className={"form-check"}>
            <input
                type="checkbox"
                name={name}
                id={id}
                onChange={onChange}
                defaultChecked={checked}
            />
        </div>
    </div>;
}
