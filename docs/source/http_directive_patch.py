# This code is copy and paste from Kelly Davis answer
# https://bitbucket.org/birkenfeld/sphinx-contrib/issues/146/httpdomain-flask-route-hello-methods-get


import re
import six
from sphinxcontrib.autohttp import common

pattern = re.compile('.. http:(get|GET|put|PUT|post|POST|OPTIONS|options|DELETE|delete):: (.*)')

def http_directive(method, path, content):
    """
    Custom http_directive that will only display parts of the
    content depending on whether the content matches the method
    and path.
    """
    method = method.lower().strip()
    if isinstance(content, six.string_types):
        content = content.splitlines()

    yield ''
    paths = [path] if isinstance(path, six.string_types) else path
    sections = dict()
    path_key = 'any'
    sections[path_key] = []
    for line in content:
        m = pattern.match(line)
        if m:
            section_method = m.group(1)
            path_key = m.group(2).lower()

        if path_key == 'any' or section_method.lower() == method:
            if not path_key in sections:
                sections[path_key] = []
            sections[path_key].append(line)
    for path in paths:
        # Replace angle brackets (flask) with parantheses (sphinx)
        to_match = path.replace('<','(').replace('>',')')

        # Search for path_key that maps to end of path
        # We can't do exact match because path includes
        # url_prefix from blueprint
        matched_path = None
        for path_key in sections:
            if path.endswith(path_key):
                matched_path = path_key
                break

        # If path_key maps to end of path
        if matched_path:
            # Yield first line of section
            yield sections[matched_path][0]
            yield ''

            # Yield common section lines
            for line in sections['any']:
                yield '   ' + line

            # Yield remainder of matched section
            if len(sections[matched_path]) > 1:
                for line in sections[matched_path][1:]:
                    yield line
        else:
            # Default behavior if no matched_path
            yield '.. http:{method}:: {path}'.format(**locals())
            yield ''
            for line in sections['any']:
                yield '   ' + line
    yield ''

# Override default version of http_directive
common.http_directive = http_directive
