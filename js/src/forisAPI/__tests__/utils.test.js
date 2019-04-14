/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


import API from '../utils';
import mockFetch from '../../testUtils/mockFetch'

describe('API utlis', () => {
    const mockedFetch = mockFetch();

    beforeEach(() => {
        global.fetch = mockedFetch;
    });

    it('Endpoints is defined correctly.', () => {
        const testAPI = new API('/test-url', [
            {name: 'one', url: '/one', methods: ['get', 'post']},
            {name: 'two', url: '/two', methods: ['post']},
            {name: 'three', url: '/three', methods: ['get']},
        ]);
        const expected = {
            one: {
                'get': expect.any(Function),
                'post': expect.any(Function),
            },
            three: {
                'get': expect.any(Function),
            },
            two: {
                'post': expect.any(Function),
            },
            url: '/test-url',
        };
        expect(testAPI).toMatchObject(expected);
    });

    it('GET call', () => {
        const testAPI = new API('/test-url', [
            {name: 'testEndpoint', url: '/test-endpoint', methods: ['get']},
        ]);

        testAPI.testEndpoint.get();
        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockedFetch).toHaveBeenCalledWith('/test-url/test-endpoint');
    });

    it('POST call.', () => {
        const testAPI = new API('/test-url', [
            {name: 'testEndpoint', url: '/test-endpoint', methods: ['post']},
        ]);
        const postData = {testKey: 'testData'};

        testAPI.testEndpoint.post(postData);
        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockedFetch).toHaveBeenCalledWith(
            '/test-url/test-endpoint',
            {
                "body": JSON.stringify(postData),
                "headers": {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                "method": "POST",
            },
        );
    });
});
