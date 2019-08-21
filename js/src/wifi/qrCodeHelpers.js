/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import pdfMake from "pdfmake";
import pdfFonts from "utils/vfs_fonts";

export function createAndDownloadPdf(SSID, password) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const docDefinition = {
        content: [
            {
                text: "Wi-Fi", style: "header", fontSize: 55, alignment: "center",
            },
            {
                qr: toQRCodeContent(SSID, password), fit: "350", margin: [0, 80], alignment: "center",
            },
            { text: `SSID: ${SSID}`, fontSize: 25, alignment: "center" },
            { text: `Password: ${password}`, fontSize: 25, alignment: "center" },
        ],
    };
    pdfMake.createPdf(docDefinition).download("wifi.pdf");
}

export function toQRCodeContent(SSID, password) {
    return `WIFI:S:${SSID};T:WPA2;P:${password};;`;
}
