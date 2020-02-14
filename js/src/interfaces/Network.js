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
    let componentContent;
    if (interfaces.length > 0) {
        if (getModulesNumber(interfaces) > 1) {
            componentContent = (
                <ModulesList
                    interfaces={interfaces}
                    selected={selected}
                    setSelected={setSelected}
                />
            );
        } else {
            componentContent = (
                <InterfaceList
                    interfaces={interfaces}
                    selected={selected}
                    setSelected={setSelected}
                />
            );
        }
    } else {
        componentContent = <p className="text-muted">{_("There are no interfaces in this group.")}</p>;
    }

    return (
        <div className="network mb-3">
            {componentContent}
        </div>
    );
}

ModulesList.propTypes = {
    interfaces: propType.arrayOf(propType.object).isRequired,
    selected: propType.string,
    setSelected: propType.func.isRequired,
};

function ModulesList({ interfaces, selected, setSelected }) {
    const groupedByModules = groupByModules(interfaces);
    const modules = Object.keys(groupedByModules);

    return modules.map((moduleID) => {
        const moduleName = moduleID === "0" ? _("Base module") : babel.format(_("Module %s"), moduleID);
        return (
            <div key={moduleID}>
                <h4>{moduleName}</h4>
                <InterfaceList
                    interfaces={groupedByModules[moduleID]}
                    selected={selected}
                    setSelected={setSelected}
                />
            </div>
        );
    });
}

InterfaceList.propTypes = {
    interfaces: propType.arrayOf(propType.object).isRequired,
    selected: propType.string,
    setSelected: propType.func.isRequired,
};

function InterfaceList({ interfaces, selected, setSelected }) {
    const interfaceComponents = interfaces.map(
        (networkInterface) => (
            <Interface
                key={networkInterface.id}
                onClick={() => setSelected(networkInterface.id)}
                isSelected={selected === networkInterface.id}
                {...networkInterface}
            />
        ),
    );
    return (
        <div className="scrollable">
            {interfaceComponents}
        </div>
    );
}

function getModulesNumber(interfaces) {
    const modulesFound = new Set();
    interfaces.some((networkInterface) => {
        modulesFound.add(networkInterface.module_id);
        return modulesFound.size > 1;
    });
    return modulesFound.size;
}

function groupByModules(interfaces) {
    const groupedByModules = {};
    interfaces.forEach((networkInterface) => {
        if (groupedByModules[networkInterface.module_id] === undefined) {
            groupedByModules[networkInterface.module_id] = [];
        }
        groupedByModules[networkInterface.module_id].push(networkInterface);
    });
    return groupedByModules;
}
