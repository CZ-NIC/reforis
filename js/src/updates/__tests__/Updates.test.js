/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, act, fireEvent, getByLabelText} from 'react-testing-library';

import {updatesFixture} from './__fixtures__/updates';
import mockFetch from '../../testUtils/mockFetch';
import Updates from '../Updates';


describe('<Updates/>', () => {
    let updatesContainer;
    beforeEach(() => {
        global.fetch = mockFetch(updatesFixture());
        const {container} = render(<Updates/>);
        updatesContainer = container;
    });

    it('Test with snapshot disabled.', () => {
        expect(updatesContainer.firstChild).toMatchSnapshot()
    });

    it('Test with snapshot enabled.', () => {
        act(() => {
            fireEvent.click(getByLabelText(updatesContainer, 'Enable automatic updates (recommended)'));
        });
        expect(updatesContainer.firstChild).toMatchSnapshot()
    });

    it('Test with snapshot delayed.', () => {
        act(() => {
            fireEvent.click(getByLabelText(updatesContainer, 'Enable automatic updates (recommended)'));
            fireEvent.click(getByLabelText(updatesContainer, 'Delayed updates'));
        });
        expect(updatesContainer.firstChild).toMatchSnapshot()
    });
});