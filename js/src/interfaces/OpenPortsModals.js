/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import {
    Modal, ModalBody, ModalFooter, ModalHeader, Button,
} from "foris";

OpenPortsModals.propTypes = {
    openPortsModalShown: PropTypes.bool.isRequired,
    setOpenPortsModalShown: PropTypes.func.isRequired,
    setPortsOpen: PropTypes.func.isRequired,
};

export default function OpenPortsModals({
    openPortsModalShown, setOpenPortsModalShown, setPortsOpen,
}) {
    const [
        confirmationModalShown,
        setConfirmationModalShown,
    ] = useState(false);

    if (openPortsModalShown) {
        return (
            <OpenPortsModal
                shown={openPortsModalShown}
                setShown={setOpenPortsModalShown}
                onClosePorts={() => setConfirmationModalShown(true)}
                onOpenPorts={() => setPortsOpen(true)}
            />
        );
    }

    if (confirmationModalShown) {
        return (
            <ConfirmationModal
                shown={confirmationModalShown}
                setShown={setConfirmationModalShown}
                onClosePorts={() => setPortsOpen(false)}
                onOpenPorts={() => setPortsOpen(true)}
            />
        );
    }

    return null;
}

OpenPortsModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    onClosePorts: PropTypes.func.isRequired,
    onOpenPorts: PropTypes.func.isRequired,
};

function OpenPortsModal({
    shown, setShown, onClosePorts, onOpenPorts,
}) {
    const message = _(`
You don't have any interface assigned to the LAN network.<br/>
Do you want to <strong>open ports 22, 80 and 443 on WAN network</strong> in order to be able to access the configuration
interface of our device?`);

    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody>
                <p dangerouslySetInnerHTML={{ __html: message }} />
            </ModalBody>
            <ModalFooter>
                <Button className="btn-danger" onClick={() => { setShown(false); onClosePorts(); }}>{_("Keep closed")}</Button>
                <Button onClick={() => { setShown(false); onOpenPorts(); }}>{_("Open ports")}</Button>
            </ModalFooter>
        </Modal>
    );
}

ConfirmationModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    onClosePorts: PropTypes.func.isRequired,
    onOpenPorts: PropTypes.func.isRequired,
};

function ConfirmationModal({
    shown, setShown, onClosePorts, onOpenPorts,
}) {
    const message = _(`
In the setup you provided it is <strong>not possible to access the administration interface</strong> of your device.
This means that the only way to configure your device will be via serial cable or you need to a perform factory reset.
<br/><br/> 
<p><strong>Is this really what you want?</strong></p>`);

    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody>
                <p dangerouslySetInnerHTML={{ __html: message }} />
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => { setShown(false); onOpenPorts(); }}>
                    {_("No, keep ports open")}
                </Button>
                <Button className="btn-danger" onClick={() => { setShown(false); onClosePorts(); }}>
                    {_("Yes, I'm an expert")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
