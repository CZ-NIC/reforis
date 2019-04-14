/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-testing-library';

import Select from '../Select';

const TEST_CHOICES = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
};

describe('<Select/>', () => {
    it('Render select', () => {
        const {container} = render(
            <Select
                label='Test label'
                value='value'
                choices={TEST_CHOICES}
                helpText={'Help text'}
                onChange={() => {
                }}
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});