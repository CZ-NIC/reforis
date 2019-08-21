/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

// Fake babel (gettext) used for docs
global._ = (str) => str;
global.babel = { format: (str) => str };
global.ForisTranslations = {};
