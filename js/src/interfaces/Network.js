/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import propType from "prop-types";

import Interface from "./Interface";

Network.propTypes = {
    interfaces: propType.arrayOf(propType.object).isRequired,
    selected: propType.string,
    setSelected: propType.func.isRequired,
};

export default function Network({ interfaces, selected, setSelected }) {
    return (
        <div className="network mb-3">
            <div className="scrollable">
                {interfaces.map(
                    (i) => (
                        <Interface
                            key={i.id}
                            onClick={() => setSelected(i.id)}
                            isSelected={selected === i.id}
                            {...i}
                        />
                    ),
                )}
            </div>
        </div>
    );
}
