/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import renderer from 'react-test-renderer';
import React from 'react';
import Checkbox from '../Checkbox'

describe('<Checkbox/>', () => {
    it('Render checkbox', () => {
        const tree = renderer
            .create(
                <Checkbox
                    label="Test label"
                    checked
                    helpText="Some help text"
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Render uncheked checkbox', () => {
        const tree = renderer
            .create(
                <Checkbox
                    label="Test label"
                    helpText="Some help text"
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});