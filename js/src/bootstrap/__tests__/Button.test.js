/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import renderer from 'react-test-renderer';
import React from 'react';
import Button from '../Button'

describe('<Button />', () => {
    it('Render button correctly', () => {
        const tree = renderer
            .create(<Button>Test Button</Button>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Render button with custom classes', () => {
        const tree = renderer
            .create(<Button className="one two three">Test Button</Button>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Render button with spinner', () => {
        const tree = renderer
            .create(<Button loading={true}>Test Button</Button>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});