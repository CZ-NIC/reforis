/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react';
import {render} from 'customTestRender';

import GuideHelp from '../GuideHelp';

describe("<GuideHelp/>", () => {
    it("displays lan help without completed message", () => {
        const { container } = render(<GuideHelp workflow="router" step="lan" />);
        expect(container.firstChild).toMatchSnapshot();
    });
    
    it("displays lan help with completed message", () => {
        const { container } = render(<GuideHelp workflow="router" step="lan" completed={true} />);
        expect(container.firstChild).toMatchSnapshot();
    });

    it("displays lan help without completed message - server workflow", () => {
        const { container } = render(<GuideHelp workflow="bridge" step="lan" />);
        expect(container.firstChild).toMatchSnapshot();
    });

    it("doesn't display completed message if it doesn't exist", () => {
        const { container } = render(<GuideHelp workflow="bridge" step="finished" completed={true} />);
        expect(container.firstChild).toMatchSnapshot();
    });

    it("doesn't display anything if step doesn't exist", () => {
        const { container } = render(<GuideHelp workflow="router" step="qwe" completed={true} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
