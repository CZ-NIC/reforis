/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

export default function Interface({type, slot, state, configurable, isSelected, onClick}) {
    return <div className={'interface ' + (isSelected ? 'interface-selected' : '')} onClick={onClick}>
        <InterfaceIcon type={type} state={state} configurable={configurable}/>
        <h5>{slot}</h5>
    </div>
}

function InterfaceIcon({type, configurable, ...props}) {
    return <div style={!configurable ? {color: 'gray'} : null}>
        {type === 'eth' ?
            <EthInterfaceIcon {...props}/> :
            type === 'wifi' ?
                <WiFiInterfaceIcon {...props}/> :
                type === 'wwan' ?
                    <WWANInterfaceIcon {...props}/> : null}
    </div>
}

function EthInterfaceIcon({state}) {
    return <span className="fa-stack fa-2x">
        <i className="far fa-square fa-stack-2x"/>
         <i className="fas fa-ethernet fa-stack-1x" style={state === 'down' ? {color: 'lightgrey'} : null}/>
    </span>
}

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
