/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'customTestRender';

import SubmitButton, {STATES} from '../SubmitButton';

describe('<SubmitButton/>', () => {
    it('Render ready', () => {
        const {container} = render(<SubmitButton state={STATES.READY}/>);
        expect(container).toMatchSnapshot();
    });
    it('Render saving', () => {
        const {container} = render(<SubmitButton state={STATES.SAVING}/>);
        expect(container).toMatchSnapshot();
    });
    it('Render load', () => {
        const {container} = render(<SubmitButton state={STATES.LOAD}/>);
        expect(container).toMatchSnapshot();
    });
});
