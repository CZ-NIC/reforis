/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-testing-library/typings';

import TextInput from '../TextInput';

describe('<TextInput/>', () => {
    it('Render text input', () => {
        const {container} = render(
            <TextInput
                label="Test label"
                helpText="Some help text"
                value="Some text"
                onChange={() => {
                }}
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});