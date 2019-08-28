/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import {
    Modal, ModalBody, ModalFooter, ModalHeader, Button,
} from "foris";

const DNSSEC_DISABLE_MESSAGE = _(`
DNSSEC is a security technology that protects the DNS communication against attacks on the DNS infrastructure.
We strongly recommend keeping DNSSEC validation enabled unless you know that you will be connecting your device in the
network where DNSSEC is broken. 

Do you still want to continue and stay unprotected?
`);

DNSSECDisableModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
};

export default function DNSSECDisableModal({ shown, setShown, callback }) {
    return (
        <Modal setShown={setShown} shown={shown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody><p>{DNSSEC_DISABLE_MESSAGE}</p></ModalBody>
            <ModalFooter>
                <Button onClick={
                    (e) => {
                        e.preventDefault();
                        setShown(false);
                    }
                }
                >
                    {_("Cancel")}
                </Button>
                <Button
                    className="btn-danger"
                    onClick={(e) => {
                        e.preventDefault();
                        callback();
                    }}
                >
                    {_("Disable DNSSEC")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
