/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import propTypes from 'prop-types';
import moment from 'moment';


DHCPClientsList.propTypes = {
    clients: propTypes.arrayOf(propTypes.object),
};

export default function DHCPClientsList({clients}) {
    return <>
        <h3>{_('DHCP clients')}</h3>
        {
            clients.length === 0 ?
                <p>{_('No DHCP clients found.')}</p>
                : <table className='table table-hover'>
                    <thead>
                    <tr className="text-center">
                        <th>{_('Expires')}</th>
                        <th>{_('IP Address')}</th>
                        <th>{_('MAC Address')}</th>
                        <th>{_('Hostname')}</th>
                        <th>{_('Active')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((client, idx) => <DHCPClientsListItem key={idx} {...client}/>)}
                    </tbody>
                </table>
        }
    </>
}

DHCPClientsListItem.propTypes = {
    ip: propTypes.string.isRequired,
    expires: propTypes.number.isRequired,
    mac: propTypes.string.isRequired,
    hostname: propTypes.string.isRequired,
    active: propTypes.bool.isRequired,
};

function DHCPClientsListItem({ip, expires, mac, hostname, active}) {
    return <tr className="text-center">
        <td>{moment.unix(expires).format('YYYY-MM-DD HH:mm')}</td>
        <td>{ip}</td>
        <td>{mac}</td>
        <td>{hostname}</td>
        <td>
            <i className={'fas ' + (active ? 'fa-check' : 'fa-times')}/>
        </td>
    </tr>
}
