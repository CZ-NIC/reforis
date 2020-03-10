/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { Button } from "foris";

import useGuideFinish from "../hooks";

export default function SkipGuideButton() {
    const onGuideFinishHandler = useGuideFinish();

    return (
        <Button
            className="btn btn-warning col-3 offset-2 mb-3"
            onClick={onGuideFinishHandler}
        >
            {_("Skip guide")}
            &nbsp;
            <i className="fas fa-forward" />
        </Button>
    );
}
