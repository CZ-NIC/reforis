/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {useCallback, useEffect, useReducer} from 'react';
import update from 'immutability-helper';

import {useAPIGet} from '../common/APIhooks';
import {useWSForisModule} from '../common/WebSocketsHooks';

export function useForm(validator, prepData) {
    const [state, dispatch] = useReducer(formReducer, {
        data: null,
        initialData: null,
        errors: {},
    });

    useEffect(() => {
        bindUnsavedChangesAlert(state.data, state.initialData);
    }, [state.data, state.initialData]);

    const onFormReload = useCallback(data => {
        dispatch({
            type: FORM_ACTIONS.resetData,
            data: data,
            prepData: prepData,
            validator: validator,
        });
    }, [prepData, validator]);

    const onFormChangeHandler = useCallback(updateRule =>
        event => {
            dispatch({
                type: FORM_ACTIONS.updateValue,
                value: getChangedValue(event.target),
                updateRule: updateRule,
                validator: validator,
            })
        }, [validator]);

    return [
        state,
        onFormChangeHandler,
        onFormReload,
    ]
}

const FORM_ACTIONS = {
    updateValue: 1,
    resetData: 2,
};

function formReducer(state, action) {
    switch (action.type) {
        case FORM_ACTIONS.updateValue:
            const newData = update(state.data, action.updateRule(action.value));
            const errors = action.validator(newData);
            return {
                ...state,
                data: newData,
                errors: errors
            };
        case FORM_ACTIONS.resetData:
            if (!action.data)
                return {...state, initialData: state.data};
            const prepData = action.prepData ? action.prepData(action.data) : action.data;
            return {
                data: prepData,
                initialData: prepData,
                errors: action.data ? action.validator(prepData) : undefined,
            };
        default:
            throw new Error();
    }
}

function getChangedValue(target) {
    let value = target.value;
    if (target.type === 'checkbox') {
        value = target.checked;
    } else if (target.type === 'number') {
        const parsedValue = parseInt(value);
        value = isNaN(parsedValue) ? value : parsedValue;
    }
    return value
}

function bindUnsavedChangesAlert(currentData, initialData) {
    window.onbeforeunload = e => {
        if (JSON.stringify(currentData) === JSON.stringify(initialData)) {
            return;
        }
        const message = _('Changes you made may not be saved.'),
            event = e || window.event;
        if (event) {
            event.returnValue = message;
        }
        return message;
    };
}

export function useForisModule(ws, config) {
    const [APIGetState, get] = useAPIGet(config.endpoint);
    const [WSData] = useWSForisModule(ws, config.wsModule, config.wsAction);

    useEffect(() => {
        get();
    }, [WSData, get]);

    return [APIGetState];
}
