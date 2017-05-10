/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const axios = require('axios');
const Message = require('../../MapStore2/web/client/components/I18N/Message');
const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');
const {SideBar} = require('../components/SideBar');
require('./style/Example.css');

const Example = React.createClass({
    propTypes: {
    },
    getDefaultProps() {
        return {
        }
    },
    renderBody() {
        return (
            <div role="body" className="scrollable">
                <h3> Lorem Ipsum </h3>
                Input: <input></input>
                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
            </div>
        )
    },
    render() {
        let assetsPath = ConfigUtils.getConfigProp("assetsPath");
        return (
            <SideBar id="Example"  width="50em" height="100%"
                title="appmenu.items.Example" icon={assetsPath + "/img/share_white.svg"}>
                {this.renderBody()}
            </SideBar>
        );
    }
});

module.exports = {
    ExamplePlugin: Example,
    reducers: {
        task: require('../reducers/task')
    }
}
