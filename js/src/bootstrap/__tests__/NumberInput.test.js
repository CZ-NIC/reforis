/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


import renderer from 'react-test-renderer';
import NumberInput from '../PasswordInput';
import React from 'react';

describe('<PasswordInput/>', () => {
    it('Render number input', () => {
        const tree = renderer
            .create(
                <NumberInput
                    label="Test label"
                    checked
                    helpText="Some help text"
                    value={1123}
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});