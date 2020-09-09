/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const guideFixtures = {
    available_workflows: ["router", "min", "bridge"],
    current_workflow: "router",
    enabled: true,
    next_step: "networks",
    passed: ["password", "profile"],
    recommended_workflow: "router",
    workflow: "router",
    workflow_steps: [
        "password",
        "profile",
        "networks",
        "wan",
        "time",
        "dns",
        "updater",
        "finished",
    ],
};
