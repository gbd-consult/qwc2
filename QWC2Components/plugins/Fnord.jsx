/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')
const axios = require('axios');
const Message = require('../../MapStore2/web/client/components/I18N/Message');
const ShareSocials = require('../../MapStore2/web/client/components/share/ShareSocials');
const ShareQRCode = require('../../MapStore2/web/client/components/share/ShareQRCode');
const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');
const ShareLink = require('../components/ShareLink');
const {SideBar} = require('../components/SideBar');
require('./style/Share.css');

const Fnord = React.createClass({
    propTypes: {
    },
    getDefaultProps() {
        return {
        }
    },
    getInitialState() {
        return {location: null};
    },
    onShow() {
        let serverUrl = ConfigUtils.getConfigProp("qwc2serverUrl");
        if(serverUrl) {
            this.setState({location: null});
            axios.get(ConfigUtils.getConfigProp("qwc2serverUrl") + "/createpermalink?url=" + encodeURIComponent(window.location.href))
            .then(response => this.setState({location: response.data.permalink}));
        } else {
            this.setState({location: window.location.href});
        }
    },
    renderBody() {
        return (
            <div role="body" className="scrollable">
                <h3> Lorem Ipsum </h3>
                <input></input>
                <p> dolor sit amet</p>
            </div>
        )
    },
    render() {
        let assetsPath = ConfigUtils.getConfigProp("assetsPath");
        return (
            <SideBar id="Fnord"  width="50em" height="100%"
                title="appmenu.items.Fnord" icon={assetsPath + "/img/share_white.svg"}>
                {this.renderBody()}
            </SideBar>
        );
    }
});

module.exports = {
    FnordPlugin: Fnord,
    reducers: {
        task: require('../reducers/task')
    }
}
