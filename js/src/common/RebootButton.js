/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useState} from 'react';
import propTypes from 'prop-types';

import {useAPIGetData} from './APIhooks';
import {APIEndpoints} from './API';
import {Modal, ModalBody, ModalFooter, ModalHeader} from './bootstrap/Modal';
import Button from './bootstrap/Button';


RebootButton.propTypes = {
    forisFormSize: propTypes.bool.isRequired,
};

export default function RebootButton({forisFormSize}) {
    const [clicked, setClicked] = useState(false);
    const [triggerReboot] = useAPIGetData(APIEndpoints.reboot);
    const [modalShown, setModalShown] = useState(false);

    function rebootHandler() {
        setClicked(true);
        triggerReboot();
        setModalShown(false)
    }

    return <>
        <RebootModal shown={modalShown} setShown={setModalShown} callback={rebootHandler}/>
        <Button
            forisFormSize={forisFormSize}
            className={'btn-danger'}
            loading={clicked}
            disabled={clicked}
            onClick={() => setModalShown(true)}
        >
            {_('Reboot')}
        </Button>
    </>
}

RebootModal.propTypes = {
    shown: propTypes.bool.isRequired,
    setShown: propTypes.func.isRequired,
    callback: propTypes.func.isRequired,
};

function RebootModal({shown, setShown, callback}) {
    return <Modal shown={shown}>
        <ModalHeader setShown={setShown} title={_('Warning!')}/>
        <ModalBody message={_('Are you sure you want to restart the router?')}/>
        <ModalFooter>
            <Button onClick={() => setShown(false)}>{_('Cancel')}</Button>
            <Button className='btn-danger' onClick={() => callback()}>{_('Confirm reboot')}</Button>
        </ModalFooter>
    </Modal>
}
