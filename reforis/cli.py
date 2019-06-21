#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.
import click
from flask import current_app
from flask.cli import with_appcontext, FlaskGroup

from . import create_app


def create_cli_app(info):
    return create_app('prod')


@click.group(cls=FlaskGroup, create_app=create_cli_app)
def cli():
    pass


@cli.command('urls', short_help='Show only urls. Similar to routes.')
@with_appcontext
def urls():
    """Show all registered routes with endpoints and methods."""

    rules = list(current_app.url_map.iter_rules())
    if not rules:
        click.echo('No urls.')
        return

    for rule in rules:
        rule_str = str(rule)
        if '<' in rule_str or '>' in rule_str:
            continue
        click.echo(rule_str)
