/*
 * Copyright (c) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

DynamicFirewallCard.propTypes = {
    activated: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
        .isRequired,
};

export default function DynamicFirewallCard({ activated }) {
    return (
        <div className="col mb-4">
            <div className="card user-select-none">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col">
                            <h6 className="text-uppercase text-muted mb-2">
                                {_("Dynamic Firewall")}
                            </h6>
                            <span className="status">
                                {activated ? _("Activated") : _("Disabled")}
                            </span>
                        </div>
                        <div className="col-auto">
                            <span
                                className={`h2 text-${
                                    activated ? "success" : "danger"
                                }`}
                            >
                                <i
                                    className={`fas fa-${
                                        activated ? "check" : "times"
                                    }`}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
