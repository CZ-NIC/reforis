from flask_babel import gettext as _

ROUTES = [
    {
        'name': _('Overview'),
        'component': 'Overview',
        'path': '/overview',
        'icon': 'list',
    }, {
        'name': _('Network Settings'),
        'icon': 'network-wired',
        'path': '/network-settings',
        'routes': [
            {
                'name': _('Wi-Fi'),
                'path': '/wifi',
                'component': 'WiFi'
            }, {
                'name': _('WAN'),
                'component': 'WAN',
                'path': '/wan',
            }, {
                'name': _('LAN'),
                'component': 'LAN',
                'path': '/lan',
            }, {
                'name': _('DNS'),
                'path': '/dns',
                'component': 'DNS',
            },
            {
                'name': _('Interfaces'),
                'path': '/interfaces',
                'component': 'Interfaces',
            },
            {
                'name': _('Guest Network'),
                'path': '/guest-network',
                'component': 'GuestNetwork',
            },
        ],
    }, {
        'name': _('Administration'),
        'path': '/administration',
        'icon': 'user-cog',
        'routes': [
            {
                'name': _('Password'),
                'path': '/password',
                'component': 'Password',
            },
            {
                'name': _('Region & Time'),
                'path': '/region-and-time',
                'component': 'RegionAndTime',
            },
            {
                'name': _('Notification Settings'),
                'path': '/notifications-settings',
                'component': 'NotificationsSettings',
            },
            {
                'name': _('Reboot'),
                'path': '/reboot',
                'component': 'Reboot',
            },
        ],
    }, {
        'name': _('Updates'),
        'path': '/updates',
        'icon': 'sync',
        'component': 'Updates'
    }, {
        'name': _('Packages'),
        'path': '/packages',
        'icon': 'box',
        'component': 'Packages'
    }, {
        'name': _('Advanced administration'),
        'path': '/cgi-bin/luci',
        'icon': 'cog',
        'isLinkOutside': True,
    }, {
        'name': _('About'),
        'path': '/about',
        'icon': 'info-circle',
        'component': 'About'
    },
    # Hidden in navigation menu
    {
        'name': _('Notifications'),
        'path': '/notifications',
        'component': 'Notifications',
        'isHidden': True,
    }
]
