/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';

import {Modal, ModalBody, ModalFooter, ModalHeader} from '../common/bootstrap/Modal';
import Button from '../common/bootstrap/Button';


export function OpenPortsModals({shown, setShown, onKeepPortsClosed}) {
    const message = _(`
You don't have any interface assigned to the LAN network.<br/>
Do you want to <strong>open ports 22, 80 and 443 on WAN network</strong> in order to be able to access the configuration
interface of our device?                
    `);

    return <Modal shown={shown}>
        <ModalHeader setShown={setShown} title={_('Warning!')}/>
        <ModalBody>
            <p dangerouslySetInnerHTML={{__html: message}}/>
        </ModalBody>
        <ModalFooter>
            <Button className='btn-danger' onClick={onKeepPortsClosed}>{_('Keep closed')}</Button>
            <Button>{_('Open ports')}</Button>
        </ModalFooter>
    </Modal>
}


export function ConfirmModal({shown, setShown}) {
    const message = _(`
In the setup you provided it is <strong>not possible to access the administration interface</strong> of your device.
This means that the only way to configure your device will be via serial cabel or you need to a perform factory reset.
<br/><br/> 
<p><strong>Is this really what you want?</strong></p>           
`);

    return <Modal shown={shown}>
        <ModalHeader setShown={setShown} title={_('Warning!')}/>
        <ModalBody>
            <p dangerouslySetInnerHTML={{__html: message}}/>
        </ModalBody>
        <ModalFooter>
            <Button onClick={e => {
                e.preventDefault();
                setShown(false)
            }}>
                {_('Reconsider')}
            </Button>
            <Button className='btn-danger'>{_('I\'m an expert')}</Button>
        </ModalFooter>
    </Modal>
}
