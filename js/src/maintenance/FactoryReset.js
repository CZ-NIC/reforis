/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { buttonFormFieldsSize } from "foris";

import FactoryResetButton from "../common/FactoryResetButton";

export default function FactoryReset() {
    return (
        <div className="card p-4 mb-3">
            <h2>{_(`Factory Reset`)}</h2>
            <p>
                {_(`Doing a factory reset on the Turris device will remove all the packages 
                installed on the device along with the data associated with them. This brings
                back all the default settings of the device as it was when the router was new,
                giving you a clean slate to start all over again.
    `)}
            </p>
            <div className={`${buttonFormFieldsSize} text-right`}>
                <FactoryResetButton forisFormSize />
            </div>
        </div>
    );
}
