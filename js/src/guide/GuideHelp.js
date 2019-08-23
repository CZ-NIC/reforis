import React from "react";
import PropTypes from "prop-types";

import { HELP_CONTENT } from "./constants";

GuideHelp.propTypes = {
    workflow: PropTypes.string.isRequired,
    step: PropTypes.string.isRequired,
    completed: PropTypes.bool,
};

GuideHelp.defaultProps = {
    completed: false,
};

export default function GuideHelp({ workflow, step, completed }) {
    const stepContent = HELP_CONTENT[workflow][step];
    if (!stepContent) {
        return null;
    }

    const isCompletedVisible = stepContent && completed && stepContent.completed;
    if (!(stepContent.initial || isCompletedVisible)) {
        return null;
    }

    return (
        <div className="card guide-card my-4">
            <div className="card-body">
                {stepContent.initial && <ParagraphsArray content={stepContent.initial} />}
                {isCompletedVisible && <p className="font-weight-bold">{ stepContent.completed }</p>}
            </div>
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
        ? content.map((line, index) => <p key={index} dangerouslySetInnerHTML={{ __html: line }} />)
        : <p dangerouslySetInnerHTML={{ __html: content }} />;
}
