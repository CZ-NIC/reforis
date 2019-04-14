/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-testing-library'

import RadioSet from '../RadioSet';

const TEST_CHOICES = [
    {label: 'label', value: 'value'},
    {label: 'another label', value: 'another value'},
    {label: 'another one  label', value: 'another on value'}
];

describe('<RadioSet/>', () => {
    it('Render radio set', () => {
        const {container} = render(
            <RadioSet
                name={'test_name'}
                label='Radios set label'
                value='value'
                choices={TEST_CHOICES}
                helpText={'Some help text'}
                onChange={() => {
                }}
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});