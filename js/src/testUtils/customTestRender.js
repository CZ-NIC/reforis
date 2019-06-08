/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {render} from '@testing-library/react'
import {UIDReset} from 'react-uid';


const customTestRender = (ui, options) => render(ui, {wrapper: UIDReset, ...options});

// re-export everything
export * from '@testing-library/react'

// override render method
export {customTestRender as render}
