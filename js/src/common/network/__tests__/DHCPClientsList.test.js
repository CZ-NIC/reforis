/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from '@testing-library/react';


import DHCPClientsList from '../DHCPClientsList';
import {clients} from './__fixtures__/DHCPClientsList';

describe('<DHCPClientsList/>', () => {
    it('Test with snapshot.', () => {
        const {container} = render(<DHCPClientsList clients={clients}/>);
        expect(container).toMatchSnapshot();
    })
});
