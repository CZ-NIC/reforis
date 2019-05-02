/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-testing-library'

import SubmitButton from '../SubmitButton';
import {FORM_STATES} from '../hooks';

describe('<SubmitButton/>', () => {
    it('Render ready', () => {
        const {container} = render(<SubmitButton state={FORM_STATES.READY}/>);
        expect(container).toMatchSnapshot();
    });
    it('Render load', () => {
        const {container} = render(<SubmitButton state={FORM_STATES.LOAD}/>);
        expect(container).toMatchSnapshot();
    });
    it('Render update', () => {
        const {container} = render(<SubmitButton state={FORM_STATES.UPDATE}/>);
        expect(container).toMatchSnapshot();
    });
    it('Render update', () => {
        const {container} = render(<SubmitButton state={FORM_STATES.NETWORK_RESTART} remindsToNWRestart={1234}/>);
        expect(container).toMatchSnapshot();
    });
});
