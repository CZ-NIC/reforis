/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import {
    API_STATE, ErrorMessage, Spinner, withErrorMessage, withSpinnerOnSending,
} from "foris";
import UpdateChecker from "./UpdateChecker";
import UpdateApproval from "./UpdateApproval";
import { useApprovals, usePending } from "./hooks";

UpdateManager.propTypes = {
    displayChecker: PropTypes.bool.isRequired,
    checkerLabel: (props, propName) => {
        if (props.displayChecker === true && !props[propName]) {
            return new Error("checkerLabel is required if displayChecker is set to true");
        }
    },
    displayApproval: PropTypes.bool.isRequired,
    description: PropTypes.string,
};

function UpdateManager({
    displayChecker, checkerLabel, displayApproval, description,
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
                className="mt-4"
            />
        );
    }

    return (
        <>
            {description}
            {displayChecker
            && (
                <UpdateChecker
                    onSuccess={getUpdateToApprove}
                    pending={pending}
                    setPending={setPending}
                >
                    {checkerLabel}
                </UpdateChecker>
            )}
            {approvalComponent}
        </>
    );
}

const UpdateManagerWithErrorAndSpinner = withSpinnerOnSending(withErrorMessage(UpdateManager));
export default UpdateManagerWithErrorAndSpinner;
