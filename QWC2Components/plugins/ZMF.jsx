/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const assign = require('object-assign');
const Message = require('../../MapStore2/web/client/components/I18N/Message');
const {SideBar} = require('../components/SideBar');
const {changeDrawingStatus, endDrawing, setCurrentStyle} = require('../../MapStore2/web/client/actions/draw');
const {setCurrentTask} = require('../actions/task');
const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');
const { TwitterPicker } = require('react-color');
const {Glyphicon} = require('react-bootstrap');
require('./style/ZMF.css');

const ZMF = React.createClass({
    propTypes: {
        drawStatus: React.PropTypes.string,
        drawOwner: React.PropTypes.string,
        drawMethod: React.PropTypes.string,
        drawMethods: React.PropTypes.array,
        features: React.PropTypes.array,
        currentStyle: React.PropTypes.object,
        changeDrawingStatus: React.PropTypes.func,
        endDrawing: React.PropTypes.func,
        setCurrentTask: React.PropTypes.func,
        setCurrentStyle: React.PropTypes.func
    },

    getInitialState() {
        return {
        }
    },

    getDefaultProps() {
        return {
            drawStatus: 'create',
            drawMethod: null,
            drawOwner: 'zmf_dialog',
            features: [],
            currentStyle: {
                strokeColor: '#ffcc33',
                strokeWidth: 2,
                fillColor: '#FFFFFF',
                fillTransparency: 0.2,
                text: '',
                fontSize: 14
            },
            drawMethods: ['Point', 'LineString', 'Polygon', 'BBOX', 'Circle']
        }
    },

  componentWillReceiveProps(newProps) {
    //draw dialog is closed and is activated because user clicks on previously drawn feature
    if (this.props.drawStatus == null && newProps.drawStatus === 'select') {
      this.props.setCurrentTask('ZMF');
      this.setState({ drawDialogOpen: true });
    }

    //recreate draw dialog with previously drawn features
    if (newProps.drawStatus === 'create') {
      this.setState({ drawDialogOpen: true });

      if(this.props.features.length > newProps.features.length) {
        this.props.changeDrawingStatus('replace', null, newProps.drawOwner, this.props.features);
      }
    }

    newProps.features.forEach(f => {
      //set current style from selected feature
      if (f.selected && Object.keys(f.style).length > 0 && newProps.drawStatus != null) {
        this.props.setCurrentStyle(f.style);
      }

      //set current style to newly created features
      if (Object.keys(f.style).length === 0) {
        f.style = this.props.currentStyle;
      }
    });
  },

    updateFeatureStyleRule(feature, ruleName, ruleValue) {
        let s = {};
        s[ruleName] = ruleValue;
        let newStyle = assign({}, this.props.currentStyle, s);

        let features = this.props.features.map(f => {
            if (f.id === feature.id) {
                let newFeature = { style: newStyle };
                return assign({}, f, newFeature);
            } else {
                return f;
            }
        });

        this.props.setCurrentStyle(newStyle);
        this.props.changeDrawingStatus('style', null, this.props.drawOwner, features);
        this.setState({ displayFillColorPicker: false, displayStrokeColorPicker: false })
    },

    statusForDrawMethod(method) {
        return this.props.drawMethod == method && this.props.drawStatus !== 'stop' ? 'active' : '';
    },

    setDrawMethod(method) {
        //let method = ev.target.value;
        this.props.changeDrawingStatus('start', method, this.props.drawOwner, this.props.features);
    },

    deleteSelectedFeatures() {
        let remainingFeatures = this.props.features.filter(feature => {
            return !feature.selected;
        });
        this.props.changeDrawingStatus('replace', null, this.props.drawOwner, remainingFeatures);
    },
    
    toggleSettings(feature) {
        let selectedFeatures = this.props.features.map(f => {
            if (f.id === feature.id) {
                let newFeature = { showSettings : !f.showSettings };
                return assign({}, f, newFeature);
            } else {
                return f;
            }
        });
        this.props.changeDrawingStatus(null ,null, this.props.drawOwner, selectedFeatures);
    },

    toggleSelection(feature) {
        let selectedFeatures = this.props.features.map(f => {
            if (f.id === feature.id) {
                let newFeature = { selected : !f.selected };
                return assign({}, f, newFeature);
            } else {
                return f;
            }
        });
        this.props.changeDrawingStatus(null ,null, this.props.drawOwner, selectedFeatures);
    },
    
    renderFeature(feature) {
        let featureSettings = null;
        if (feature.showSettings) {
            featureSettings = (
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label for="fillcolorpicker"><Message msgId="draw.fillcolor" /></label>
                                    <input type="text"  id="fillcolorpicker" className="form-control" style={{backgroundColor: this.props.currentStyle.fillColor}}
                                      onChange={(evt) => this.updateFeatureStyleRule(feature, 'fillColor', evt.target.value)}
                                      onClick={() => this.state.displayFillColorPicker ? this.setState({ displayFillColorPicker: false }):this.setState({ displayFillColorPicker: true })}/>
                                    <span className={this.state && this.state.displayFillColorPicker ? "color-picker" : "collapse" }>
                                        <TwitterPicker color={this.props.currentStyle.fillColor} onChangeComplete={(color) => this.updateFeatureStyleRule(feature, 'fillColor', color.hex)} />
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label for="opacityslider"><Message msgId="draw.fillopacity" /></label>
                                    <input id="opacityslider" className="form-control" type="range" min="0" max="1" step="0.1" value={this.props.currentStyle.fillTransparency}
                                    onChange={(evt) => this.updateFeatureStyleRule(feature,'fillTransparency', evt.target.value)} />
                                    <label for="opacityslider">{this.props.currentStyle.fillTransparency*100}%</label>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Message msgId="draw.strokecolor" /></label>
                                    <input type="text" className="form-control" style={{backgroundColor: this.props.currentStyle.strokeColor}}
                                    onChange={(evt) => this.updateFeatureStyleRule(feature, 'strokeColor', evt.target.value)}
                                    onClick={() => this.state.displayStrokeColorPicker ? this.setState({ displayStrokeColorPicker: false }):this.setState({ displayStrokeColorPicker: true })}/>
                                    <span className={this.state && this.state.displayStrokeColorPicker ? "color-picker" : "collapse" }>
                                        <TwitterPicker color={this.props.currentStyle.StrokeColor} onChangeComplete={(color) => this.updateFeatureStyleRule(feature, 'strokeColor', color.hex)} />
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Message msgId="draw.strokewidth" /></label>
                                    <input className="form-control" type="text" value={this.props.currentStyle.strokeWidth}
                                    onChange={(evt) => this.updateFeatureStyleRule(feature, 'strokeWidth', evt.target.value)} />
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-9">
                                <label><Message msgId="draw.text" /></label>
                                <input className="form-control" type="text" value={this.props.currentStyle.text}
                                onChange={(evt) => this.updateFeatureStyleRule(feature, 'text', evt.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <label><Message msgId="draw.fontsize" /></label>
                                <input className="form-control" type="text" value={this.props.currentStyle.fontSize}
                                onChange={(evt) => this.updateFeatureStyleRule(feature, 'fontSize', evt.target.value)} />
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-md-3">add</div>
                            <div className="col-md-6">more</div>
                            <div className="col-md-3">content</div>
                        </div>
                    </li>
                </ul>
            )
        }
        return (
                <div className={feature.selected ? "panel panel-primary" : "panel panel-default"}>
                    <div className="panel-heading">
                        <span onClick={() => this.toggleSelection(feature)}>
                            {feature.type} {feature.id.slice(0,8)}
                        </span>
                        <span className="featurelist-item-spacer" onClick={() => this.toggleSelection(feature)} />
                        <span className="featurelist-item-cog">
                            <Glyphicon glyph="cog" onClick={() => this.toggleSettings(feature)}/>
                        </span>
                    </div>
                    {featureSettings}
                </div>
        )
    },

    renderBody() {
        let featureSelection = null;
        if (this.props.features.length > 0) {
            featureSelection = (
                <div className="featureList">
                    <h3> Layers: </h3>
                    <div className="panel-group">
                        {this.props.features.map(this.renderFeature)}
                    </div>
                </div>
            );
        }
        return (
            <div role="body" className="scrollable">
                <div className="btn-group btn-group-justified" role="group" aria-label="...">
                    {this.props.drawMethods.map(method => {
                        return (
                            <div className="btn-group" role="group">
                                <button onClick={()=>this.setDrawMethod(method)} type="button"
                                className={this.statusForDrawMethod(method) ? "btn btn-primary" : "btn btn-default"}>
                                    <Message msgId={"draw." + method}  />
                                </button>
                            </div>
                        )
                    })}
                </div>
                {featureSelection}
            </div>
        )
    },
    render() {
        let assetsPath = ConfigUtils.getConfigProp("assetsPath");
        return (
            <SideBar id="ZMF"  width="40em" height="100%"
                title="appmenu.items.ZMF" icon={assetsPath + "/img/share_white.svg"}>
                {this.renderBody()}
            </SideBar>
        );
    }
});

const selector = (state) => ({
  drawStatus: state.draw.drawStatus,
  drawMethod: state.draw.drawMethod,
  drawOwner: state.draw.drawOwner,
  features: state.draw.features,
  currentStyle: state.draw.currentStyle
});

module.exports = {
 ZMFPlugin: connect(selector, {
   setCurrentTask: setCurrentTask,
   changeDrawingStatus: changeDrawingStatus,
   endDrawing: endDrawing,
   setCurrentStyle: setCurrentStyle
 })(ZMF),
 reducers: {
   draw: require('../../MapStore2/web/client/reducers/draw')
 }
}
