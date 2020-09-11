/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect } from "react";

import { useAPIPost, REFORIS_URL_PREFIX, API_STATE, useAlert } from "foris";
import API_URLs from "common/API";

export default function useGuideFinish() {
    const [finishGuidePostData, finishGuidePost] = useAPIPost(
        API_URLs.finishGuide
    );
    const [setAlert] = useAlert();

    useEffect(() => {
        if (finishGuidePostData.state === API_STATE.SUCCESS) {
            window.location.assign(`${REFORIS_URL_PREFIX}/`);
        } else if (finishGuidePostData.state === API_STATE.ERROR) {
            setAlert(_("Cannot mark guide as finished."));
        }
    }, [finishGuidePostData, setAlert]);

    function onGuideFinishHandler(e) {
        e.persist();
        finishGuidePost();
    }

    return onGuideFinishHandler;
}
