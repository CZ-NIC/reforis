/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment/moment";

import {
    Select,
    DataTimeInput,
    SpinnerElement,
    Button,
    API_STATE,
    useAPIPost,
    useAPIGet,
} from "foris";

import API_URLs from "common/API";
import { useNTPDate, useEditServers } from "./hooks";
import NTPModal from "./NTPModal";
import "./TimeForm.css";

// Foris backend ignore value after "."...
const TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss.0";

const TIME_SETTING_TYPE_CHOICES = {
    ntp: _("Via NTP"),
    manual: _("Manually"),
};

TimeForm.propTypes = {
    ws: PropTypes.object.isRequired,

    formData: PropTypes.shape({
        time_settings: PropTypes.shape({
            how_to_set_time: PropTypes.oneOf(["ntp", "manual"]),
            ntp_servers: PropTypes.arrayOf(PropTypes.string),
            time: PropTypes.oneOfType([
                PropTypes.objectOf(moment),
                PropTypes.string,
            ]),
        }).isRequired,
    }).isRequired,

    formErrors: PropTypes.shape({
        time_settings: PropTypes.shape({
            time: PropTypes.string,
        }),
    }).isRequired,

    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

TimeForm.defaultProps = {
    formData: { time_settings: {} },
    formErrors: { time_settings: {} },
    setFormValue: () => {},
};

export default function TimeForm({
    ws,
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const [ntpData, triggerNTP] = useNTPDate(ws);
    useEffect(() => {
        if (ntpData.data) {
            const { time } = ntpData.data;
            const momentTime = moment(time).isValid()
                ? moment(time).format(TIME_FORMAT)
                : time;
            setFormValue((value) => ({
                time_settings: { time: { $set: value } },
            }))({ target: { value: momentTime } });
        }
    }, [setFormValue, ntpData.data]);

    function updateTimeFromBrowser(e) {
        e.preventDefault();
        setFormValue((value) => ({
            time_settings: { time: { $set: value } },
        }))({ target: { value: moment() } });
    }

    const data = formData.time_settings;
    const errors = formErrors.time_settings || {};

    function onDataTimeChangeHandler(value) {
        // Dirty hack to get DataTime library work
        if (typeof value === "string") {
            return setFormValue((formValue) => ({
                time_settings: { time: { $set: formValue } },
            }))({ target: { value } });
        }
        return setFormValue((formValue) => ({
            time_settings: { time: { $set: formValue } },
        }))({ target: { value: value.format(TIME_FORMAT) } });
    }

    return (
        <>
            <h2>{_("Time Settings")}</h2>
            <p>
                {_(
                    "Time should be up-to-date otherwise DNS and other services might not work properly."
                )}
            </p>
            <Select
                label={_("How to set time")}
                choices={TIME_SETTING_TYPE_CHOICES}
                value={data.how_to_set_time}
                onChange={setFormValue((value) => ({
                    time_settings: { how_to_set_time: { $set: value } },
                }))}
                disabled={disabled}
            />
            {data.how_to_set_time === "ntp" && (
                <NTPServersList servers={data} formData={formData} />
            )}
            <DataTimeInput
                label={_("Time")}
                value={
                    moment(data.time).isValid() ? moment(data.time) : data.time
                }
                error={errors.time}
                onChange={onDataTimeChangeHandler}
                disabled={
                    data.how_to_set_time !== "manual" ||
                    ntpData.state === API_STATE.SENDING
                }
            >
                <div className="input-group-append">
                    <button
                        type="button"
                        className="input-group-text"
                        onClick={
                            data.how_to_set_time === "ntp"
                                ? triggerNTP
                                : updateTimeFromBrowser
                        }
                        disabled={ntpData.state === API_STATE.SENDING}
                    >
                        {ntpData.state === API_STATE.SENDING ? (
                            <SpinnerElement small />
                        ) : (
                            <i className="fas fa-sync-alt" />
                        )}
                    </button>
                </div>
            </DataTimeInput>
        </>
    );
}

NTPServersList.propTypes = {
    servers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function NTPServersList({ servers, formData }) {
    const [shown, setShown] = useState(false);
    const [NTPModalShown, setNTPModalShown] = useState(false);
    const [serverList, setFormValue, saveServer, removeServer] = useEditServers(
        servers
    );

    function addServer() {
        //tohle pak přesunout do hooks?
        setNTPModalShown(true);
    }

    return (
        <>
            <Button
                className="btn-outline-primary"
                forisFormSize
                data-toggle="collapse"
                href="#collapseNTPServers"
                onClick={(e) => {
                    e.preventDefault();
                    setShown(!shown);
                }}
            >
                {shown
                    ? _("Hide NTP servers list")
                    : _("Show NTP servers list")}
            </Button>

            <div className="collapse" id="collapseNTPServers">
                <h5>{_("NTP Servers")}</h5>
                <div id="ntpServersList">
                    {servers.ntp_servers.map((server) => (
                        <p key={server}>{server}</p>
                    ))}
                </div>
                <h5>{_("Custom NTP Servers")}</h5>
                <div id="ntpServersList">
                    {servers.ntp_extras.map((server) => (
                        <p
                            key={server}
                            onClick={(value) =>
                                removeServer(value.target.innerHTML)
                            }
                        >
                            {server}
                        </p>
                    ))}
                </div>
                <Button
                    className="btn-outline-success btn mb-3 mb-sm-2 mb-md-0"
                    onClick={addServer}
                >
                    {_("Add NTP Server")}
                </Button>
                <NTPModal
                    shown={NTPModalShown}
                    setShown={setNTPModalShown}
                    title={_("Add NTP Server")}
                    servers={servers}
                    formData={formData}
                />
            </div>
        </>
    );
}
