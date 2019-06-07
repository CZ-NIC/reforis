/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import Select from '../Select';
import {fireEvent, getByDisplayValue, getByText, render} from '@testing-library/react';

const TEST_CHOICES = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
};

describe('<Select/>', () => {
    var selectContainer;
    const onChangeHandler = jest.fn();
    beforeEach(() => {
        const {container} = render(
            <Select
                label='Test label'
                value='1'
                choices={TEST_CHOICES}
                helpText='Help text'

                onChange={onChangeHandler}
            />
        );
        selectContainer = container;
    });

    it('Test with snapshot.', () => {
        expect(selectContainer).toMatchSnapshot();
    });

    it('Test onChange handling.', () => {
        const select = getByDisplayValue(selectContainer, 'one');
        expect(select.value).toBe('1');
        fireEvent.change(select, {target: {value: '2'}});

        const option = getByText(selectContainer, 'two');
        expect(onChangeHandler).toBeCalled();

        expect(option.value).toBe('2');
    })
});
