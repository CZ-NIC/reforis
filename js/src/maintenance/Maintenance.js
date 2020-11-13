/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { isPluginInstalled } from "foris";
import Reboot from "./Reboot";
import FactoryReset from "./FactoryReset";
import Syslog from "./Syslog/Syslog";

export default function Maintenance() {
    return (
        <>
            <h1>{_("Maintenance")}</h1>
            <p>
                {_(
                    `The Maintenance tab allows you to reboot the router or bring back all the default settings by performing a factory reset.`
                )}
            </p>

            <Reboot />
            <FactoryReset />
            {isPluginInstalled("Storage") ? <Syslog /> : null}
        </>
    );
}
