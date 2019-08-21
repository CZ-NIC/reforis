/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import Button from "common/bootstrap/Button";

import useGuideFinish from "./hooks";

export default function GuideFinished() {
    const onGuideFinishHandler = useGuideFinish();
    return (
        <>
            <h2>{_("Guide Finished")}</h2>
            <p>
                {_(
                    `
Congratulations you've successfully reached the end of this guide. Once you leave this guide you'll be granted access 
to the full configuration interface of this device.

To further improve your security consider enabling data collect (start by selecting it in updater tab).
This will allow you to be part of our security research to discover new attackers and it will also give you access to 
dynamic updates to your firewall to block all already known attackers.
            `,
                )}
            </p>
            <Button forisFormSize onClick={onGuideFinishHandler}>{_("Continue")}</Button>
        </>
    );
}
