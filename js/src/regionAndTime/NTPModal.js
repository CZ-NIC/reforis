/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { Modal, ModalBody, ModalHeader } from "foris";
import NTPForm from "./NTPForm";

export default function NTPModal({
    shown,
    setShown,
    title,
    servers,
    formData,
}) {
    return (
        <Modal scrollable shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={title} />
            <ModalBody>
                <NTPForm servers={servers} formData={formData} />
            </ModalBody>
        </Modal>
    );
}
