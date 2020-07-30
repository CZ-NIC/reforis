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
            className="guide-controls-button btn btn-warning"
            onClick={onGuideFinishHandler}
        >
            <span className="d-none d-sm-block">
                {_("Skip guide")}
                &nbsp;
            </span>
            <i className="fas fa-forward" />
        </Button>
    );
}
