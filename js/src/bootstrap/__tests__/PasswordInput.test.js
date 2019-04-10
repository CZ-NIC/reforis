/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */
import renderer from 'react-test-renderer';
import PasswordInput from '../PasswordInput';
import React from 'react';

describe('<PasswordInput/>', () => {
    it('Render password input', () => {
        const tree = renderer
            .create(
                <PasswordInput
                    label="Test label"
                    checked
                    helpText="Some help text"
                    value="Some password"
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

});