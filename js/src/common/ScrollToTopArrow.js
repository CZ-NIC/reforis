/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import "./ScrollToTopArrow.css";

const ScrollToTopArrow = () => {
    const [showScrollArrow, setShowScrollArrow] = useState(false);

    const checkScrollToTop = () => {
        if (!showScrollArrow && window.pageYOffset > 400) {
            setShowScrollArrow(true);
        } else if (showScrollArrow && window.pageYOffset <= 400) {
            setShowScrollArrow(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("scroll", checkScrollToTop);

    return (
        <div
            title={_("Go to top")}
            className="scrollToTop"
            style={{
                display: showScrollArrow ? "flex" : "none",
            }}
            onClick={scrollToTop}
            onKeyPress={scrollToTop}
            role="button"
            tabIndex={0}
        >
            <i className="fas fa-angle-up" />
        </div>
    );
};

export default ScrollToTopArrow;
