/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {fireEvent, getByLabelText, getByText, render, wait} from 'customTestRender';

import { WebSockets } from "foris";
import mockAxios from 'jest-mock-axios';
import Interfaces from '../Interfaces';
import {interfacesFixture} from './__fixtures__/interfaces';


describe('<Interfaces/>', () => {
    let interfacesContainer;

    beforeEach(async () => {
        const webSockets = new WebSockets();
        const {container} = render(<Interfaces ws={webSockets}/>);
        mockAxios.mockResponse({data: interfacesFixture()});
        await wait(() => getByText(container, 'LAN1'));
        interfacesContainer = container
    });

    it('Snapshot.', () => {
        expect(interfacesContainer).toMatchSnapshot();
    });

    it('Snapshot select interface.', () => {
        fireEvent.click(getByText(interfacesContainer, 'LAN1'));
        expect(interfacesContainer).toMatchSnapshot();
    });

    it('Snapshot after interface moving.', () => {
        fireEvent.click(getByText(interfacesContainer, 'LAN1'));
        fireEvent.change(getByLabelText(interfacesContainer, 'Network'), {target: {value: 'lan'}});
        expect(interfacesContainer).toMatchSnapshot();
    });

    it('Test post.', async () => {
        fireEvent.click(getByText(interfacesContainer, 'LAN1'));
        fireEvent.change(getByLabelText(interfacesContainer, 'Network'), {target: {value: 'lan'}});
        fireEvent.click(getByText(interfacesContainer, 'Save'));

        expect(mockAxios.post).toBeCalled();
        const data = {
            "firewall": {"http_on_wan": false, "https_on_wan": false, "ssh_on_wan": false},
            "networks": {"guest": ["lan4"], "lan": ["lan3", "lan1"], "none": ["lan0", "lan2"], "wan": ["eth2"]}
        };
        expect(mockAxios.post).toHaveBeenCalledWith('/api/interfaces', data, expect.anything());
    });
});
