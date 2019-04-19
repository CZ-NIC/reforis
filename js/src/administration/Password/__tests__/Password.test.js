/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {act, fireEvent, getByText, getByLabelText, render, wait} from 'react-testing-library'
import mockFetch from '../../../testUtils/mockFetch';
import Password from '../Password';

describe('<Password/>', () => {
    let passwordContainer;

    beforeEach(async () => {
        global.fetch = mockFetch({password_set: true});
        const {container} = render(<Password/>);
        await wait(() => getByText(container, 'Advanced administration (root) password'));
        passwordContainer = container;
    });
    it('Snapshot', async () => {
        expect(passwordContainer).toMatchSnapshot();
    });
    it('Snapshot: same password for root', () => {
        act(() => {
            fireEvent.click(getByLabelText(passwordContainer, 'Use same password for advanced administration (root)'))
        });
        expect(passwordContainer).toMatchSnapshot();
    });
});