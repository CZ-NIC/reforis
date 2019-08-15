/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';

export const INTERFACE_TYPES = {
    eth: 'eth',
    wifi: 'wifi',
    wwan: 'wwan',
};

export const INTERFACE_STATES = {
    up: 'up',
    down: 'down',
};

Interface.propTypes = {
    type: propTypes.oneOf(Object.keys(INTERFACE_TYPES)).isRequired,
    slot: propTypes.string.isRequired,
    state: propTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
    configurable: propTypes.bool.isRequired,
    isSelected: propTypes.bool.isRequired,
    onClick: propTypes.func.isRequired,
};

export default function Interface({type, slot, state, configurable, isSelected, onClick}) {
    return <button type="button" className={'interface ' + (isSelected ? 'interface-selected' : '')} onClick={onClick}>
        <InterfaceIcon type={type} state={state} configurable={configurable}/>
        <h5>{slot}</h5>
    </button>
}

InterfaceIcon.propTypes = {
    type: propTypes.oneOf(Object.keys(INTERFACE_TYPES)).isRequired,
    configurable: propTypes.bool.isRequired,
};


function InterfaceIcon({type, configurable, ...props}) {
    return <div style={!configurable ? {color: 'gray'} : null}>
        {type === INTERFACE_TYPES.eth ?
            <EthInterfaceIcon {...props}/> :
            type === INTERFACE_TYPES.wifi ?
                <WiFiInterfaceIcon {...props}/> :
                type === INTERFACE_TYPES.wwan ?
                    <WWANInterfaceIcon {...props}/> : null}
    </div>
}


EthInterfaceIcon.propTypes = {
    state: propTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
};

function EthInterfaceIcon({state}) {
    return <span className="fa-stack fa-2x">
        <i className="far fa-square fa-stack-2x"/>
         <i className="fas fa-ethernet fa-stack-1x" style={state === 'down' ? {color: 'lightgrey'} : null}/>
    </span>
}

WiFiInterfaceIcon.propTypes = {
    state: propTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
};


function WiFiInterfaceIcon({state}) {
    return <span className="fa-stack fa-2x">
        <i className="fas fa-wifi fa-stack-1x"/>
        {state === 'down' ?
            <>
                <i className="fas fa-slash fa-stack-1x fa-inverse"/>
                <i className="fas fa-slash fa-stack-1x" style={{bottom: '0.3rem'}}/>
            </>
            : null}
    </span>
}

WWANInterfaceIcon.propTypes = {
    state: propTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
};

function WWANInterfaceIcon({state}) {
    return <span className="fa-stack fa-2x">
        <i className="fas fa-signal fa-stack-1x"/>
        {state === 'down' ?
            <>
                <i className="fas fa-slash fa-stack-1x fa-inverse" style={{top: '0.1rem'}}/>
                <i className="fas fa-slash fa-stack-1x fa-inverse" style={{top: '0.5rem'}}/>
                <i className="fas fa-slash fa-stack-1x" style={{top: '0.3rem'}}/>
            </>
            : null}
    </span>
}
