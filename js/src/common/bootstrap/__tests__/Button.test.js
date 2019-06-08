/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'customTestRender';

import Button from '../Button'

describe('<Button />', () => {
    it('Render button correctly', () => {
        const {container} = render(<Button>Test Button</Button>);
        expect(container.firstChild).toMatchSnapshot()
    });

    it('Render button with custom classes', () => {
        const {container} = render(<Button className="one two three">Test Button</Button>)
        expect(container.firstChild).toMatchSnapshot()
    });

    it('Render button with spinner', () => {
        const {container} = render(<Button loading={true}>Test Button</Button>)
        expect(container.firstChild).toMatchSnapshot()
    });
});
