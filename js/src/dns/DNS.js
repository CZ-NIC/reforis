/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import API_URLs from "common/API";
import { validateDomain } from "common/validations";
import ForisForm from "form/ForisForm";
import ConnectionTest from "connectionTest/ConnectionTest";

import DNSForm from "./DNSForm";

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
            <p dangerouslySetInnerHTML={{
                __html: _(`
Router Turris uses its own DNS resolver with DNSSEC support. It is capable of working independently or it
can forward your DNS queries your internet service provider's DNS resolver.
<br/><br/>
The following setting determines the behavior of the DNS resolver. Usually, it is better to use the ISP's
resolver in networks where it works properly. If it does not work for some reason, it is necessary to use
direct resolving without forwarding.
<br/><br/>
In rare cases ISP's have improperly configured network which interferes with DNSSEC validation. If you
experience problems with DNS, you can <b>temporarily</b> disable DNSSEC validation to determine the source
of the problem. However, keep in mind that without DNSSEC validation, you are vulnerable to DNS spoofing
attacks! Therefore we <b>recommend keeping DNSSEC turned on</b> and resolving the situation with your ISP as
this is a serious flaw on their side.
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
                prepDataToSubmit={prepDataToSubmit}
            >
                <DNSForm />
            </ForisForm>

            <h1>{_("Connection test")}</h1>
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
        error.dns_from_dhcp_domain = validateDomain(formData.dns_from_dhcp_domain);
    }
    return error.dns_from_dhcp_domain ? error : undefined;
}

function prepDataToSubmit(formData) {
    delete formData.available_forwarders;
    if (!formData.forwarding_enabled) delete formData.forwarder;
    return formData;
}
