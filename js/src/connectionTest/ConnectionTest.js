/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { buttonFormFieldsSize } from "foris";

import useConnectionTest from "./hooks";
import ConnectionTestResults from "./ConnectionTestResult";
import ConnectionTestButton from "./ConnectionTestButton";

ConnectionTest.propTypes = {
    ws: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["wan", "dns"]).isRequired,
    overview: PropTypes.bool,
};

export default function ConnectionTest({ ws, type, overview }) {
    const [state, testResults, triggerTest] = useConnectionTest(ws, type);

    function onSubmit(e) {
        e.preventDefault();
        triggerTest();
    }

    const insideCard = overview ? "" : "card p-4 mb-3";

    return (
        <div className={insideCard}>
            <form>
                <ConnectionTestResults state={state} {...testResults} />
                <div className={`${buttonFormFieldsSize} text-right`}>
                    <ConnectionTestButton
                        state={state}
                        onClick={onSubmit}
                        overview={overview}
                    />
                </div>
            </form>
        </div>
    );
}
