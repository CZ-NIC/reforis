/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {fireEvent, render, waitForElement} from "foris/testUtils/customTestRender";
import mockAxios from 'jest-mock-axios';

import { WebSockets } from "foris";

import ConnectionTest from '../ConnectionTest';

describe('<ConnectionTest/>', () => {
    const webSockets = new WebSockets();

    it('Snapshot before connection test.', () => {
        const {asFragment} = render(<ConnectionTest ws={webSockets} type='wan'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('Snapshot after trigger WAN connection test.', async () => {
        const {asFragment, getByText} = render(<ConnectionTest ws={webSockets} type='wan'/>);
        fireEvent.click(getByText('Test connection'));
        mockAxios.mockResponse({data: {test_id: "test-id"}});
        await waitForElement(() => getByText('IPv6 connectivity'));

        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith('/reforis/api/connection-test', undefined, expect.anything());
        expect(asFragment()).toMatchSnapshot();
    });

    it('Snapshot after trigger DNS connection test.', async () => {
        const {asFragment, getByText} = render(<ConnectionTest ws={webSockets} type='dns'/>);
        fireEvent.click(getByText('Test connection'));
        mockAxios.mockResponse({data: {test_id: "test-id"}});
        await waitForElement(() => getByText(/DNSSEC/));

        expect(mockAxios.post).toBeCalled();
        expect(mockAxios.post).toHaveBeenCalledWith('/reforis/api/dns/test', undefined, expect.anything());
        expect(asFragment()).toMatchSnapshot();
    })
});
