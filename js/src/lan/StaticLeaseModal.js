/*
 * Copyright (C) 2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { Modal, ModalBody, ModalHeader } from "foris";
import { useCallback } from "react";
import StaticLeaseModalForm from "./StaticLeaseModalForm";

export default function StaticLeaseModal({
    shown,
    setShown,
    title,
    addNewTableItem,
}) {
    const postCallback = useCallback(() => {
        setShown(false);
    }, [setShown]);

    return (
        <Modal scrollable shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={title} />
            <ModalBody>
                <StaticLeaseModalForm
                    saveStaticLeaseCallback={postCallback}
                    addNewTableItem={addNewTableItem}
                />
            </ModalBody>
        </Modal>
    );
}
