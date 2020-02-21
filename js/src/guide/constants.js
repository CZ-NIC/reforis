/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const GUIDE_URL_PREFIX = "/guide";

const HELP_CONTENT_DEFAULTS = {
    password: {
        initial: [_("Welcome to Foris web interface. This guide will help you to setup your device. Firstly it is required to set your password. Note the security of your home network is in your hands, so try not to use weak passwords.")],
        completed: _("Your password is set. You may proceed to the next step."),
    },
    profile: {
        completed: _("The workflow was set. You may proceed to next step."),
    },
    networks: {
        initial: [
            _("Here you need to decide which interfaces belong to which network."),
            _("If you are in doubt use the current settings."),
        ],
        completed: _("You've configured your network interfaces. It seems that you didn't break any crucial network settings so you can safely proceed to the next step."),
    },
    time: {
        initial: _("Now you need to set the time and timezone of your device."),
        completed: _("Your time and timezone seem to be set. Please make sure that the time matches the time on your computer if not try to update it via NTP or manually."),
    },
    dns: {
        initial: _("A proper DNS resolving is one of the key security features of your device. Let's configure it now."),
        completed: _("You've updated your DNS configuration. Try to run connection test to see whether your DNS resolver is properly set."),
    },
    wan: {
        initial: _("In order to access the internet, you need to configure your WAN interface."),
        completed: _("You've configured your WAN interface. Try to run connection test to see whether it is working properly and if so you can safely proceed to the next step."),
    },
    lan: {
        initial: _("Now you should configure your LAN interface. Note that when you change your network settings you probably won't be able to connect to the configuration interface unless you restart the network on your current device."),
        completed: _("You've configured your LAN interface. Try to test whether settings work properly and if so you can safely proceed to the next step."),
    },
};

export const HELP_CONTENT = {
    unset: { ...HELP_CONTENT_DEFAULTS },
    router: {
        ...HELP_CONTENT_DEFAULTS,
        finished: {
            initial: _("Congratulations! Now your device is able to act as a router and route network traffic among LAN, WAN and guest network."),
        },
    },
    min: {
        ...HELP_CONTENT_DEFAULTS,
        finished: {
            initial: _("Minimal device setup is finished. Note that you probably need to perform some further configuration updates to fit the device to your needs."),
        },
    },
    bridge: {
        ...HELP_CONTENT_DEFAULTS,
        networks: {
            ...HELP_CONTENT_DEFAULTS.networks,
            initial: [
                HELP_CONTENT_DEFAULTS.networks.initial[0],
                _("You chose to act as local server this means that it doesn't make sense to put any interfaces to your WAN and Guest Network. So it is a good idea to assign all interfaces to LAN."),
            ],
        },
        lan: {
            initial: [
                _("To act as a local server, there's no need to manage LAN (if you still want to manage it reset the guide and choose the Router workflow). You probably want to act as a client here thus select <strong>Computer</strong> mode here."),
                _("If you select the <strong>static</strong> configuration be sure that the IP addresses are entered correctly otherwise you won't be able to access this configuration interface when the new settings are applied."),
                _("If you select the <strong>DHCP</strong> method you probably you need to obtain a new IP address of this device. You can obtain it from the DHCP server which is managing your LAN. Then you need to connect to the new IP address to proceed the guide."),
                _("Note that either way you might need to re-plug your ethernet cables after you update the settings here."),
            ],
            completed: _("Please test whether the settings you provided are correctly working. This means that you can access the configuration interface of your device and your device is able to access the internet (you can use the connection test below)."),
        },
        finished: {
            initial: _("Congratulations! Now your device should be able to act as a server on your local network."),
        },
    },
};
