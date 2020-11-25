/*
 * Copyright (c) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button,
    useAPIPut,
} from "foris";

import { API_MODULE_URLs } from "./API";

ResetButton.propTypes = {
    forisFormSize: PropTypes.bool,
};

export default function ResetButton({ forisFormSize }) {
    const [clicked, setClicked] = useState(false);
    const [, triggerReset] = useAPIPut(API_MODULE_URLs.schnapps);
    const [modalShown, setModalShown] = useState(false);

    function resetHandler() {
        setClicked(true);
        triggerReset();
        setModalShown(false);
    }

    return (
        <>
            <ResetModal
                shown={modalShown}
                setShown={setModalShown}
                callback={resetHandler}
            />
            <Button
                forisFormSize={forisFormSize}
                className="btn-danger"
                loading={clicked}
                disabled={clicked}
                onClick={() => setModalShown(true)}
            >
                {_("Reset")}
            </Button>
        </>
    );
}

ResetModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
};

function ResetModal({ shown, setShown, callback }) {
    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody>
                <p>{_("Are you sure you want to reset the router?")}</p>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => setShown(false)}>{_("Cancel")}</Button>
                <Button className="btn-danger" onClick={callback}>
                    {_("Confirm factory reset")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
