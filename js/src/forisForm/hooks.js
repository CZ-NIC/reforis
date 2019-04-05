/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useReducer} from 'react';
import update from 'immutability-helper';

export const FORM_STATES = {
    READY: 1,
    UPDATE: 2,
    NETWORK_RESTART: 3,
    LOAD: 4,
};

export const FORM_ACTIONS = {
    setData: 1,
    setState: 2,
};

function formReducer(state, action) {
    console.log(action); //TODO: remove
    switch (action.type) {
        case FORM_ACTIONS.setData: {
            return {
                data: action.data,
                errors: action.errors,
                state: FORM_STATES.READY,
            };
        }
        case FORM_ACTIONS.setState:
            return {
                ...state,
                state: action.state
            };
        default:
            return state;
    }
}

export function useForm(prepData, validator) {
    const [state, dispatch] = useReducer(formReducer,
        {
            data: {},
            errors: {},
            state: FORM_STATES.LOAD
        }
    );

    function getChangedValue(target) {
        let value = target.value;
        if (target.type === 'checkbox')
            value = target.checked;
        else if (target.type === 'number')
            value = parseInt(value);
        return value
    }

    function setFormValue(updateRule) {
        return event => {
            const value = getChangedValue(event.target);
            const newData = update(state.data, updateRule(value));
            dispatch({
                type: FORM_ACTIONS.setData,
                data: newData,
                errors: validator(newData),
            });
        };
    }

    function setFormData(data) {
        const newData = prepData(data);
        dispatch({
            type: FORM_ACTIONS.setData,
            data: newData,
            errors: validator(newData),
        });
    }

    function setFormState(state) {
        dispatch({
            type: FORM_ACTIONS.setState,
            state: state,
        });
    }

    function isDisabled() {
        return state.state !== FORM_STATES.READY;
    }

    return [
        state.data,
        state.errors,
        setFormData,

        state.state,
        setFormState,

        isDisabled(),
        setFormValue,
        dispatch,
    ]
}