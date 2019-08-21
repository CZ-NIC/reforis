/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const HELP_TEXTS = {
    smtp_type: _("If you set SMTP provider to \"Turris\", the servers provided to members of the Turris project would be "
        + "used. These servers do not require any additional settings. If you want to set your own SMTP server, please "
        + "select \"Custom\" and enter required settings."),
    common: {
        to: _("Email address of recipient. Separate multiple addresses by comma."),
        send_news: _("Send emails about new features."),
    },
    smtp_turris: {
        sender_name: _("Name of the sender - will be used as a part of the sender's email address before the \"at\" sign."),
    },
    smtp_custom: {
        from: _("This is the address notifications are send from."),
    },
};

export default HELP_TEXTS;
