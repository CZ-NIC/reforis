/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { Modal, ModalBody, ModalHeader } from "foris";
import ForwarderForm from "./ForwarderForm";

ForwarderModal.propTypes = {
    forwarder: PropTypes.object,
    shown: PropTypes.bool,
    setShown: PropTypes.func,
    title: PropTypes.string,
};

export default function ForwarderModal({
    shown, setShown, forwarder, title,
}) {
    const postCallback = useCallback(
        () => { setShown(false); },
        [setShown],
    );

    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader
                setShown={setShown}
                title={title}
            />
            <ModalBody>
                <ForwarderForm
                    forwarder={forwarder}
                    saveForwarderCallback={postCallback}
                />
            </ModalBody>
        </Modal>
    );
}
