/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'react-testing-library/typings'

import Checkbox from '../Checkbox'

describe('<Checkbox/>', () => {
    it('Render checkbox', () => {
        const {container} = render(
            <Checkbox
                label="Test label"
                checked
                helpText="Some help text"
                onChange={()=>{}}
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it('Render uncheked checkbox', () => {
        const {container} = render(
            <Checkbox
                label="Test label"
                helpText="Some help text"
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});