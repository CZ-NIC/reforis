/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export default function validator(formData) {
    const errors = {
        newForisPassword: validatePassword(formData.newForisPassword),
        newRootPassword: !formData.sameForRoot ? validatePassword(formData.newRootPassword) : null,
    };

    if (errors.newForisPassword || errors.newRootPassword)
        return errors;
    return {}
}

function validatePassword(password) {
    if (password === '')
        return _('Password can\'t be empty.');

    if (password.length < 6)
        return _('Password should have min 6 symbols.');

    if (password.length > 128)
        return _('Password should have max 128 symbols.');

    return null
}