/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, {useEffect, useRef} from 'react';
import propTypes from 'prop-types';

Modal.propTypes = {
    /** Is modal shown value */
    shown: propTypes.bool.isRequired,

    /** Modal content use following: `ModalHeader`, `ModalBody`, `ModalFooter` */
    children: propTypes.oneOfType([
        propTypes.arrayOf(propTypes.node),
        propTypes.node
    ]).isRequired
};

export function Modal({shown, setShown, children}) {
    const dialogRef = useRef();

    useEffect(() => {
        function handleClickOutsideDialog(e) {
            if (!dialogRef.current.contains(e.target))
                setShown(false);
        }

        document.addEventListener("mousedown", handleClickOutsideDialog);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDialog);
        };
    }, [setShown]);


    return <div className={'modal fade ' + (shown ? 'show' : '')} role="dialog">
        <div ref={dialogRef} className="modal-dialog" role="document">
            <div className="modal-content">
                {children}
            </div>
        </div>
    </div>
}

ModalHeader.propTypes = {
    setShown: propTypes.func.isRequired,
    title: propTypes.string.isRequired,
};

export function ModalHeader({setShown, title}) {
    return <div className="modal-header">
        <h5 className="modal-title">{title}</h5>
        <button type="button" className="close" onClick={() => setShown(false)}>
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
}

ModalBody.propTypes = {
    children: propTypes.oneOfType([
        propTypes.arrayOf(propTypes.node),
        propTypes.node
    ]).isRequired
};

export function ModalBody({children}) {
    return <div className="modal-body">{children}</div>
}

ModalFooter.propTypes = {
    children: propTypes.oneOfType([
        propTypes.arrayOf(propTypes.node),
        propTypes.node
    ]).isRequired
};

export function ModalFooter({children}) {
    return <div className="modal-footer">
        {children}
    </div>
}
