/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import QRCode from "qrcode.react";
import PropTypes from "prop-types";

import {
    Modal, ModalBody, ModalFooter, ModalHeader, Button
} from "foris";
import { ForisURLs } from "foris";

import { createAndDownloadPdf, toQRCodeContent } from "./qrCodeHelpers";

WiFiQRCode.propTypes = {
    SSID: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
};

const QR_ICON_PATH = `${ForisURLs.static}/imgs/QR_icon.svg`;

export default function WiFiQRCode({ SSID, password }) {
    const [modal, setModal] = useState(false);

    return (
        <>
            <button
                className="input-group-text"
                onClick={(e) => {
                    e.preventDefault();
                    setModal(true);
                }}
            >
                <img width="20" src={QR_ICON_PATH} alt="QR" />
            </button>
            {modal
                ? <QRCodeModal setShown={setModal} shown={modal} SSID={SSID} password={password} />
                : null}
        </>
    );
}

QRCodeModal.propTypes = {
    SSID: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
};

function QRCodeModal({
    shown, setShown, SSID, password,
}) {
    return (
        <Modal setShown={setShown} shown={shown}>
            <ModalHeader setShown={setShown} title={_("Wi-Fi QR Code")} />
            <ModalBody>
                <QRCode
                    renderAs="svg"
                    value={toQRCodeContent(SSID, password)}
                    level="M"
                    size={350}
                    includeMargin
                    style={{ display: "block", margin: "auto" }}
                />
            </ModalBody>
            <ModalFooter>
                <Button
                    className="btn-outline-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        createAndDownloadPdf(SSID, password);
                    }}
                >
                    <i className="fas fa-arrow-down" />
                    {_("Download PDF")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
