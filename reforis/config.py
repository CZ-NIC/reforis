# TODO: This is just dev settings and should be changed.

DEBUG = True
SECRET_KEY = 'dev_secret_key'

# Session
SESSION_TYPE = 'filesystem'
SESSION_PERMANENT = False
SESSION_FILE_DIR = '/tmp/foris-sessions'
SESSION_FILE_THRESHOLD = 10

# Bus
BUS = 'mqtt'
BUSES_CONF = {
    'mqtt': {
        'host': 'localhost',
        'port': 11883,
        'credentials_file': '/etc/fosquitto/credentials.plain',
        'timeout': 30000,
    },
    'bus': {
        'path': '/var/run/ubus.sock',
        'timeout': 30000
    }
}

# WebSockets
WS_PORT = 9081
