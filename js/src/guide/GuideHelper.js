/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { HELP_CONTENT } from "./constants";
import GuideControls from "./GuideControls/GuideControls";

GuideHelper.propTypes = {
    ws: PropTypes.object.isRequired,
    workflow: PropTypes.string.isRequired,
    step: PropTypes.string.isRequired,
    next_step: PropTypes.string.isRequired,
    completed: PropTypes.bool,
};

GuideHelper.defaultProps = {
    completed: false,
};

export default function GuideHelper({
    ws, workflow, step, next_step, completed,
}) {
    const stepContent = HELP_CONTENT[workflow][step];
    if (!stepContent) {
        return null;
    }

    const isCompletedVisible = stepContent && completed && stepContent.completed;
    if (!(stepContent.initial || isCompletedVisible)) {
        return null;
    }

    return (
        <div className="card guide-card">
            <div className="card-body">
                {stepContent.initial && <ParagraphsArray content={stepContent.initial} />}
                {isCompletedVisible && <p className="font-weight-bold">{ stepContent.completed }</p>}
            </div>
            <GuideControls ws={ws} next_step={next_step} />
        </div>
    );
}

ParagraphsArray.propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
};

function ParagraphsArray({ content }) {
    return Array.isArray(content)
        // eslint-disable-next-line react/no-array-index-key
        ? content.map((line, index) => <p key={index} dangerouslySetInnerHTML={{ __html: line }} />)
        : <p dangerouslySetInnerHTML={{ __html: content }} />;
}
