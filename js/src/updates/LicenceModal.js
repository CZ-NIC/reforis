/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'

export default function LicenceModal() {
    return <div
        className="modal fade"
        id="licenceModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{_('Most important license agreement points')}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <ul dangerouslySetInnerHTML={{
                        __html: _(`
                    <li>Automatic updates are offered to the Turris router owners free of charge.</li>
                    <li>Updates are prepared exclusively by CZ.NIC, z. s. p. o.</li>
                    <li>
                        Enabling of the automatic updates is a prerequisite for additional security features of
                        Turris router.
                    </li>
                    <li>
                        Automatic updates take place at the time of their release, the time of installation
                        cannot be influenced by the user.
                    </li>
                    <li>
                        Having the automatic updates turned on can result in increased Internet traffic on your
                        router. Expenses related to this increase are covered by you.
                    </li>
                    <li>
                        Automatic updates cannot protect you against every attack coming from the Internet.
                        Please do not forget to protect your workstations and other devices by installing
                        antivirus software and explaining to your family members how to stay safe on the
                        Internet.
                    </li>
                    <li>
                        CZ.NIC, z. s. p. o. does not guarantee the availability of this service and is not
                        responsible for any damages caused by the automatic updates.
                    </li>
                  `)
                    }}
                    />
                    <b>
                        By enabling of the automatic updates, you confirm that you are the owner of this Turris
                        router and you agree with the full text of the
                        <a href="https://www.turris.cz/omnia-updater-eula">license agreement</a>.
                    </b>
                </div>
            </div>
        </div>
    </div>
}

