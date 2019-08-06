/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {fireEvent, getByText, render} from 'customTestRender';

import GuideFinish from '../GuideFinish';
import mockAxios from 'jest-mock-axios';

describe('<GuideFinish/> and useGuideFinish hook', () => {
    let guideFinishContainer;

    beforeEach(async () => {
        const {container} = render(<GuideFinish/>);
        guideFinishContainer = container
    });

    it('Snapshot.', () => {
        expect(guideFinishContainer).toMatchSnapshot();
    });

    it('useGuideFinish hook', () => {
        fireEvent.click(getByText(guideFinishContainer, 'Continue'));

        expect(mockAxios.post).toHaveBeenCalledWith('/api/finish-guide', undefined, expect.anything());
    });
});
