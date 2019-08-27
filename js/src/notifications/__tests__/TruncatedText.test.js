/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'customTestRender';

import TruncatedText from '../Notifications/TruncatedText';

describe("<TruncatedText/>", () => {
    const ipsum = "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.";

    it("displays text without show more/less button", () => {
        const { container } = render(<TruncatedText text={ipsum} charLimit={200} />);
        expect(container).toMatchSnapshot();
    });

    it("displays text with show more/less button", () => {
        const { container } = render(<TruncatedText text={ipsum} charLimit={50} />);
        expect(container).toMatchSnapshot();
    });

    it("doesn't truncate the text then limit is exceeded below threshold", () => {
        const { container } = render(<TruncatedText text={ipsum} charLimit={130} />);
        expect(container).toMatchSnapshot();
    });
});
