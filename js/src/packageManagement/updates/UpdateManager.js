/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import {
    API_STATE,
    Alert,
    ALERT_TYPES,
    ErrorMessage,
    Spinner,
    withErrorMessage,
    withSpinnerOnSending,
    formFieldsSize,
} from "foris";
import UpdateChecker from "./UpdateChecker";
import UpdateApproval from "./UpdateApproval";
import { useApprovals, usePending } from "./hooks";

UpdateManager.propTypes = {
    displayChecker: PropTypes.bool.isRequired,
    checkerLabel: (props, propName) => {
        if (props.displayChecker === true && !props[propName]) {
            return new Error(
                "checkerLabel is required if displayChecker is set to true"
            );
        }
    },
    displayApproval: PropTypes.bool.isRequired,
    description: PropTypes.string,
    delay: PropTypes.number,
};

function UpdateManager({
    displayChecker,
    checkerLabel,
    displayApproval,
    description,
    delay,
}) {
    const [pending, setPending] = usePending();
    const [
        getApprovalsResponse,
        getApprovals,
        updateToApprove,
        getUpdateToApprove,
    ] = useApprovals(displayApproval);

    let approvalComponent;
    if (pending || getApprovalsResponse.state === API_STATE.SENDING) {
        approvalComponent = <Spinner className="text-center" />;
    } else if (getApprovalsResponse.state === API_STATE.ERROR) {
        approvalComponent = <ErrorMessage />;
    } else if (getApprovalsResponse.state === API_STATE.SUCCESS) {
        approvalComponent = (
            <UpdateApproval
                update={updateToApprove}
                onSuccess={getApprovals}
                delay={delay}
            />
        );
    }
    return (
        <>
            {displayChecker ? (
                <>
                    <div className={`${formFieldsSize}`}>
                        <h2>{_("Updates Check")}</h2>
                        <p>{description}</p>
                        <UpdateChecker
                            onSuccess={getUpdateToApprove}
                            pending={pending}
                            setPending={setPending}
                        >
                            {checkerLabel}
                        </UpdateChecker>
                    </div>
                    <div className={`${formFieldsSize}`}>
                        <h2>{_("Available Updates")}</h2>
                        <p>
                            {_(`Here you can find and approve available updates for 
                    Turris OS and other components.`)}
                        </p>
                        {approvalComponent || (
                            <p className="text-center text-muted">
                                {_("You're up to date.")}
                            </p>
                        )}
                    </div>
                </>
            ) : (
                <Alert type={ALERT_TYPES.WARNING}>
                    <span dangerouslySetInnerHTML={{ __html: description }} />
                </Alert>
            )}
        </>
    );
}

export default withSpinnerOnSending(withErrorMessage(UpdateManager));
