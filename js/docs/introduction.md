## reForis React application

reForis application has set of main componets, which represent singe pages such as `<WAN/>`, `<RegionAndTime/>` and 
others.

Each main components are dynamically load by HTML containers (see `src/app.js` and reforis Flask application templates).

The reForis forms components are created in order to be used inside `<ForisForm/>` component. It component is HOC
which encapsulates entire form logic and provided children required props. This component structure provides comfort API
and allows to create typical foris forms easily.

basic element usage is described in this documentation.
