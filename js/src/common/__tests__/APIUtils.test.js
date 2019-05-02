/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */


import API from '../APIUtils';
import mockAxios from 'jest-mock-axios';

describe('API utlis', () => {
    it('Endpoints is defined correctly.', () => {
        const testAPI = new API('/test-url', {
            one: {name: 'one', url: '/one', methods: ['get', 'post']},
            two: {name: 'two', url: '/two', methods: ['post']},
            three: {name: 'three', url: '/three', methods: ['get']},
        });
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
        const testAPI = new API('/test-url', {
            testEndpoint: {name: 'testEndpoint', url: '/test-endpoint', methods: ['get']},
        });

        testAPI.testEndpoint.get();
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith('/test-url/test-endpoint', expect.anything());
    });

    it('POST call.', () => {
        const testAPI = new API('/test-url', {
            testEndpoint: {name: 'testEndpoint', url: '/test-endpoint', methods: ['post']},
        });
        const postData = {testKey: 'testData'};

        testAPI.testEndpoint.post(postData);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/test-url/test-endpoint',
            postData,
            expect.anything(),
        );
    });
});
