/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, queryByText} from 'react-testing-library';

import {packagesFixture} from './__fixtures__/packages';
import Packages from '../Packages';
import mockAxios from 'jest-mock-axios';

describe('<Packages/>', () => {
    let packagesContainer;
    beforeEach(() => {
        const {container} = render(<Packages/>);
        mockAxios.mockResponse({data: packagesFixture()});
        packagesContainer = container;
    });

    it('Test with snapshot.', () => {
        expect(packagesContainer.firstChild).toMatchSnapshot()
    });
    it('Test hidden.', () => {
        const HTMLHiddenPackageMessage = queryByText(packagesContainer, 'Hidden package msg');
        expect(HTMLHiddenPackageMessage).toBeNull();
    })
});
