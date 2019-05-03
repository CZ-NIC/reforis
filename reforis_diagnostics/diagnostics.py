#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

import gzip
import io

from flask import Blueprint, current_app, redirect, render_template, request, url_for, send_file

diagnostics = Blueprint(
    'Diagnostics',
    __name__,
    template_folder='templates',
    url_prefix='/diagnostics'
)


@diagnostics.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template(
            'diagnostics/index.html',
            **current_app.backend.perform('diagnostics', 'list_modules'),
            **current_app.backend.perform('diagnostics', 'list_diagnostics')
        )
    if request.method == 'POST':
        print(request.form)
        current_app.backend.perform(
            'diagnostics',
            'prepare_diagnostic',
            {'modules': [diagnostic for diagnostic in request.form]}
        )
        return redirect(url_for('Diagnostics.index'))


@diagnostics.route('/delete', methods=['POST'])
def delete():
    current_app.backend.perform('diagnostics', 'remove_diagnostic', {'diag_id': request.form['id']})
    return redirect(url_for('Diagnostics.index'))


@diagnostics.route('/download', methods=['POST'])
def download():
    diagnostics = current_app.backend.perform('diagnostics', 'list_diagnostics')['diagnostics']
    for diagnostic in diagnostics:
        if request.form['id'] == diagnostic['diag_id']:
            filename = f'{diagnostic["diag_id"]}.txt.gz'
            with open(diagnostic['path'], 'rb') as f_in:
                buf = io.BytesIO()
                f_out = gzip.GzipFile(filename=filename, mode="wb", fileobj=buf)
                f_out.write(f_in.read())
                f_out.flush()
                f_out.close()
                buf.seek(0)
                return send_file(
                    buf,
                    as_attachment=True,
                    attachment_filename=filename,
                )
