/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import API_URLs from "common/API";
import { validateDomain, ForisForm } from "foris";

import ConnectionTest from "connectionTest/ConnectionTest";

import DNSForm from "./DNSForm";
import PROVIDER_FORWARDER from "./constants";

DNS.propTypes = {
    ws: PropTypes.object.isRequired,
    postCallback: PropTypes.func,
};

DNS.defaultProps = {
    postCallback: () => undefined,
};

export default function DNS({ ws, postCallback }) {
    return (
        <>
            <h1>DNS</h1>
            <div
                dangerouslySetInnerHTML={{
                    __html: _(`
<p>Router Turris uses its own DNS resolver with DNSSEC support. It is capable of working independently or it
can forward your DNS queries your internet service provider's DNS resolver.<p/>
<p>The following setting determines the behavior of the DNS resolver. Usually, it is better to use the ISP's
resolver in networks where it works properly. If it does not work for some reason, it is necessary to use
direct resolving without forwarding.<p/>
<p>In rare cases ISP's have improperly configured network which interferes with DNSSEC validation. If you
experience problems with DNS, you can <b>temporarily</b> disable DNSSEC validation to determine the source
of the problem. However, keep in mind that without DNSSEC validation, you are vulnerable to DNS spoofing
attacks! Therefore we <b>recommend keeping DNSSEC turned on</b> and resolving the situation with your ISP as
this is a serious flaw on their side.</p>
            `),
                }}
            />
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.dns,
                    wsModule: "dns",
                }}
                postCallback={postCallback}
                validator={validator}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
            >
                <DNSForm ws={ws} />
            </ForisForm>

            <h2>{_("Connection Test")}</h2>
            <p
                dangerouslySetInnerHTML={{
                    __html: _(`
Here you can test your internet connection. This test is also useful when you need to check that your DNS resolving 
works as expected. Remember to click on the <b>Save button</b> if you changed your forwarder setting.
        `),
                }}
            />
            <ConnectionTest ws={ws} type="dns" />
        </>
    );
}

function validator(formData) {
    const error = {};
    if (formData.dns_from_dhcp_enabled) {
        error.dns_from_dhcp_domain = validateDomain(
            formData.dns_from_dhcp_domain
        );
    }
    return error.dns_from_dhcp_domain ? error : undefined;
}

function prepData(formData) {
    if (formData.forwarder === "") formData.forwarder = PROVIDER_FORWARDER;
    return formData;
}

function prepDataToSubmit(formData) {
    delete formData.available_forwarders;
    if (!formData.forwarding_enabled) delete formData.forwarder;
    else if (formData.forwarder === PROVIDER_FORWARDER) formData.forwarder = "";
    return formData;
}
