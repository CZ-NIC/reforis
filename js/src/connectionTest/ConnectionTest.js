/*
 * Copyright (C) 2020-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import useConnectionTest from "./hooks";
import ConnectionTestResults from "./ConnectionTestResult";
import ConnectionTestButton from "./ConnectionTestButton";

ConnectionTest.propTypes = {
    ws: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["wan", "dns", "overview"]).isRequired,
};

export default function ConnectionTest({ ws, type }) {
    const [state, testResults, triggerTest] = useConnectionTest(ws, type);

    function onSubmit(e) {
        e.preventDefault();
        triggerTest();
    }

    const insideCard = type === "overview" ? "" : "card p-4 mb-3";

    return (
        <div className={insideCard}>
            <form>
                <ConnectionTestResults state={state} {...testResults} />
                <div className="col-sm-12 col-lg-12 p-0 mb-0 text-right">
                    <ConnectionTestButton
                        state={state}
                        onClick={onSubmit}
                        type={type}
                    />
                </div>
            </form>
        </div>
    );
}
