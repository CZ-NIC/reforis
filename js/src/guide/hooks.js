/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {useEffect} from 'react';
import {useAPIPost} from '../common/APIhooks';
import API_URLs from '../common/API';
import {REFORIS_PREFIX} from '../common/constants';

export function useGuideFinish() {
    const [finishGuidePostData, finishGuidePost] = useAPIPost(API_URLs.finishGuide);

    useEffect(() => {
        if (finishGuidePostData.data && finishGuidePostData.isSuccess)
            window.location.href = `${REFORIS_PREFIX}/`;

    }, [finishGuidePostData.data, finishGuidePostData.isSuccess]);

    function onGuideFinishHandler(e) {
        e.persist();
        finishGuidePost()
    }

    return onGuideFinishHandler
}
