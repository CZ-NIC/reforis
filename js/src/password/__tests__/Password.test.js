/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {render, wait, act, fireEvent, getByText, getByLabelText} from 'react-testing-library/typings'
import mockAxios from 'jest-mock-axios/dist/lib/index';

import Password from '../Password';

describe('<Password/>', () => {
    let passwordContainer;

    beforeEach(async () => {
        const {container} = render(<Password/>);
        mockAxios.mockResponse({data: {password_set: true}});
        await wait(() => getByText(container, 'Advanced administration (root) password'));
        passwordContainer = container;
    });
    it('Snapshot', () => {
        expect(passwordContainer).toMatchSnapshot();
    });
    it('Snapshot: same password for root', () => {
        act(() => {
            fireEvent.click(getByLabelText(passwordContainer, 'Use same password for advanced administration (root)'))
        });
        expect(passwordContainer).toMatchSnapshot();
    });
});
