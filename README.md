QGIS Web Client 2 Components
============================

This repository contains the QWC2 application components as well as the
MapStore2 upstream components.

See [qwc2-demo-app](https://github.com/gbd-consult/qwc2-demo-app) for an example application built on top of the QWC2 components.

Developing Plugins
------------------
Plugins are stored unter ./QWC2Components/plugins/. To devolop your own you should start by copying one of the existing Plugins.
There is an Example plugin to serve as a blueprint. Style information for the Plugins is stored under ./QWC2Components/plugins/style/.
To embed your Plugin into the *qwc2-demo-app* it needs to be added to the ./config.json and ./js/appConfig.js configuration files.

