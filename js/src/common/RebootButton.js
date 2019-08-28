/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import {
    Modal, ModalBody, ModalFooter, ModalHeader, Button, useAPIPost,
} from "foris";

import API_URLs from "./API";

RebootButton.propTypes = {
    forisFormSize: PropTypes.bool,
};

export default function RebootButton({ forisFormSize }) {
    const [clicked, setClicked] = useState(false);
    const [, triggerReboot] = useAPIPost(API_URLs.reboot);
    const [modalShown, setModalShown] = useState(false);

    function rebootHandler() {
        setClicked(true);
        triggerReboot();
        setModalShown(false);
    }

    return (
        <>
            <RebootModal shown={modalShown} setShown={setModalShown} callback={rebootHandler} />
            <Button
                forisFormSize={forisFormSize}
                className="btn-danger"
                loading={clicked}
                disabled={clicked}
                onClick={() => setModalShown(true)}
            >
                {_("Reboot")}
            </Button>
        </>
    );
}

RebootModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
};

function RebootModal({ shown, setShown, callback }) {
    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody><p>{_("Are you sure you want to restart the router?")}</p></ModalBody>
            <ModalFooter>
                <Button onClick={() => setShown(false)}>{_("Cancel")}</Button>
                <Button className="btn-danger" onClick={callback}>{_("Confirm reboot")}</Button>
            </ModalFooter>
        </Modal>
    );
}
