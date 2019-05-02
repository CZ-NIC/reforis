/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render, waitForElement, act, fireEvent} from 'react-testing-library'

import {mockedWS} from '../../testUtils/mockWS';

import ForisForm from '../ForisForm';
import mockFetch from '../../testUtils/mockFetch';

// It's possible to unittest each hooks via react-hooks-testing-library.
// But it's better and easier to test it by test components which uses this hooks...

const TestForm = (props) => {
    return <input
        data-testid="test-input"
        onChange={props.setFormValue(value => ({field: {$set: value}}))}
        value={props.formData.field}
    >
    </input>
};

let mockedFetch;
let mockValidator;
let mockPrepData;
let mockPrepDataToSubmit;
let mockWebSockets;
let input;
const Child = jest.fn((props) => <TestForm {...props}/>);
let form;

beforeEach(async () => {
    mockedFetch = mockFetch({field: 'fetchedData'});
    global.fetch = mockedFetch;
    mockWebSockets = new mockedWS();
    mockPrepData = jest.fn(data => ({...data, preparedField: 'preparedData'}));
    mockPrepDataToSubmit = jest.fn(data => ({field: 'preparedDataToSubmit'}));
    mockValidator = jest.fn(data => data.field === 'badValue' ? {field: 'Error!'} : {});
    const {getByTestId, container} = render(
        <ForisForm
            ws={mockWebSockets}
            module='wan' // Just some module which exists...
            prepData={mockPrepData}
            prepDataToSubmit={mockPrepDataToSubmit}
            validator={mockValidator}
        >
            <Child/>
        </ForisForm>
    );
    input = await waitForElement(() =>
        getByTestId('test-input')
    );
    form = container.firstChild
});

describe('useForm hook.', () => {
    it('Validation on changing.', () => {
        expect(mockValidator).toHaveBeenCalledTimes(1);
        expect(Child).toHaveBeenCalledTimes(4);
        expect(Child.mock.calls[3][0].formErrors).toMatchObject({});
        act(() => {
            fireEvent.change(input, {target: {value: 'badValue', type: 'text'}})
        });
        expect(Child).toHaveBeenCalledTimes(6);
        expect(mockValidator).toHaveBeenCalledTimes(2);
        expect(Child.mock.calls[5][0].formErrors).toMatchObject({field: "Error!"});
    });

    it('Update text value.', () => {
        act(() => {
            fireEvent.change(input, {target: {value: 'newValue', type: 'text'}})
        });
        expect(input.value).toBe('newValue');
    });
    it('Update text value.', () => {
        act(() => {
            fireEvent.change(input, {target: {value: 123, type: 'number'}})
        });
        expect(input.value).toBe("123");
    });
    it('Update checkbox value.', () => {
        act(() => {
            fireEvent.change(input, {target: {checked: true, type: 'checkbox'}})
        });
        expect(input.checked).toBe(true);
    });
});

describe('useForisForm hook.', () => {
    it('Fetch data.', () => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(Child.mock.calls[0][0].formData).toMatchObject({field: "fetchedData"});
    });
    it('Submit.', async () => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockPrepDataToSubmit).toHaveBeenCalledTimes(0);
        await act(async () => {
            await fireEvent.submit(form);
        });
        expect(mockPrepDataToSubmit).toHaveBeenCalledTimes(1);
        expect(mockedFetch).toHaveBeenCalledTimes(2);
        expect(mockedFetch.mock.calls[1]).toMatchObject(["/api/wan", {
            body: "{\"field\":\"preparedDataToSubmit\"}",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            method: "POST"
        }]);
    });
});
