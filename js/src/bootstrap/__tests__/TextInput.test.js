/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import renderer from 'react-test-renderer';
import TextInput from '../TextInput';
import React from 'react';

describe('<TextInput/>', () => {
    it('Render text input', () => {
        const tree = renderer
            .create(
                <TextInput
                    label="Test label"
                    checked
                    helpText="Some help text"
                    value="Some text"
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});