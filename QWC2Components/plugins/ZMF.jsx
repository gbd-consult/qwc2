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
const {Glyphicon, Button, ButtonGroup, FormControl, FormGroup, ControlLabel, Modal, Grid, Row, Col, Accordion, Panel, ListGroup, ListGroupItem, Collapse, Well} = require('react-bootstrap');
require('./style/ZMF.css');

class SettingsForm extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            displayColorPicker : false,
            value : this.props.feature.style[this.props.rule]
        };
    }

    validateInteger(){
        if (!isNaN(this.state.value)) {
            return "success";
        } else {
            return "error";
        }
    }

    handleChange(e){
        this.setState({ value : e.target.value });
    }

    render(){
        switch(this.props.type) {
            case "color":
                return (
                    <FormGroup>
                        <ControlLabel><Message msgId={"zmf.featureSettings." + this.props.rule}/></ControlLabel>
                        <FormControl type="text" style={{ backgroundColor : this.props.feature.style[this.props.rule] }}
                        onClick={() => this.setState({ displayColorPicker : !this.state.displayColorPicker })}/>
                        <span className={this.state && this.state.displayColorPicker ? "color-picker" : "collapse" }>
                            <TwitterPicker color={this.state.value} onChangeComplete={(color) => {
                                this.props.onStyleChange(this.props.feature, this.props.rule, color.hex);
                                this.setState({ displayColorPicker : false });
                            }} />
                        </span>
                    </FormGroup>
                );
                break;
            case "integer":
                return (
                    <FormGroup validationState={this.validateInteger()}>
                    <ControlLabel><Message msgId={"zmf.featureSettings." + this.props.rule} /></ControlLabel>
                    <FormControl type="text" value={this.props.feature.style[this.props.rule]}
                    onChange={(evt) => {
                        this.handleChange(evt);
                        this.props.onStyleChange(this.props.feature, this.props.rule, evt.target.value);
                        }} />
                    </FormGroup>
                );
                break;
            case "text":
                return (
                    <FormGroup>
                    <ControlLabel><Message msgId={"zmf.featureSettings." + this.props.rule} /></ControlLabel>
                    <FormControl type="text" value={this.props.feature.style[this.props.rule]}
                    onChange={(evt) => {
                        this.handleChange(evt);
                        this.props.onStyleChange(this.props.feature, this.props.rule, evt.target.value);
                        }} />
                    </FormGroup>
                );
                break;
            case "slider":
                return (
                    <FormGroup>
                    <ControlLabel><Message msgId={"zmf.featureSettings." + this.props.rule}/></ControlLabel>
                    <FormControl bsClass="zmf-slider" type="range" min="0" max="1" step="0.1" value={this.props.feature.style[this.props.rule]}
                    onChange={(evt) => this.props.onStyleChange(this.props.feature, this.props.rule, evt.target.value)} />
                    </FormGroup>
                );
                break;
            default:
                break;

        }
    }
}

class Settings extends React.Component {
    // Icon that opens the Settings dialog for a certain feature
    constructor(...args) {
        super(...args);
        this.state = {
            showSettings : false,
            displayFillColorPicker : false,
            displayStrokeColorPicker : false
        };
    }
    open() {
        this.setState({ showSettings : true });
    }
    close() {
        this.setState({
            showSettings : false,
            displayFillColorPicker : false,
            displayStrokeColorPicker : false
        });
    }
    render() {
        return (
            <Glyphicon style={{ float : this.props.float }} glyph="cog" onClick={(e) => {
                e.stopPropagation();
                this.open();
                }}>
                <Modal show={this.state.showSettings} onHide={() => this.close()}>
                    <Modal.Header closeButton>
                        <h3>
                            <Message msgId="zmf.featureSettings.header"/>
                        </h3>
                        <h4>
                            {this.props.feature.id}
                        </h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Grid fluid>
                            <Row>
                                <Col md={6}>
                                    <SettingsForm type="color" rule="fillColor" 
                                    feature={this.props.feature} onStyleChange={this.props.onStyleChange}/>
                                </Col>
                                <Col md={6}>
                                    <SettingsForm type="color" rule="strokeColor" 
                                    feature={this.props.feature} onStyleChange={this.props.onStyleChange}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <SettingsForm type="slider" rule="fillTransparency"
                                    feature={this.props.feature} onStyleChange={this.props.onStyleChange}/>
                                </Col>
                                <Col md={6}>
                                    <SettingsForm type="integer" rule="strokeWidth"
                                    feature={this.props.feature} onStyleChange={this.props.onStyleChange}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <SettingsForm type="text" rule="text"
                                    feature={this.props.feature} onStyleChange={this.props.onStyleChange}/>
                                </Col>
                                <Col md={6}>
                                    <SettingsForm type="integer" rule="fontSize"
                                    feature={this.props.feature} onStyleChange={this.props.onStyleChange}/>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </Glyphicon>
        )


    }
}

class Feature extends React.Component {
    constructor(...args){
        super(args);
        this.state = {};
    }
    render(){
        return (
            <ListGroupItem href="#" active={this.props.feature.selected} onClick={() => {
                this.props.handleSelect(this.props.feature);
                }}>
            {this.props.feature.type} : {this.props.feature.id.slice(0,8)}
                <Settings float="right" feature={this.props.feature} onStyleChange={this.props.onStyleChange}/>
            </ListGroupItem>
        );
    }
}

class ZMF extends React.Component {
    constructor(...args){
        super(args);
        this.state = {}
    }
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
    }
    updateFeatureStyleRule(feature, ruleName, ruleValue) {
        let s = {};
        s[ruleName] = ruleValue;
        let newStyle = assign({}, feature.style, s);

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
    }
    statusForDrawMethod(method) {
        return this.props.drawMethod == method && this.props.drawStatus !== 'stop' ? 'active' : '';
    }
    setDrawMethod(method) {
        //let method = ev.target.value;
        this.props.changeDrawingStatus('start', method, this.props.drawOwner, this.props.features);
    }
    selectAllFeatures() {
        let selectedFeatures = this.props.features.map(f => {
            return assign({}, f, {selected : true})
        });
        this.props.changeDrawingStatus(null, null, this.props.drawOwner, selectedFeatures);
    }
    invertFeatureSelection() {
        let selectedFeatures = this.props.features.map(f => {
            return assign({}, f, {selected : !f.selected})
        });
        this.props.changeDrawingStatus(null, null, this.props.drawOwner, selectedFeatures);
    }
    deleteSelectedFeatures() {
        let remainingFeatures = this.props.features.filter(feature => {
            return !feature.selected;
        });
        this.props.changeDrawingStatus('replace', null, this.props.drawOwner, remainingFeatures);
    }
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
    }
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
    }
    renderBody() {
        let featureSelection = null;
        let selectDeleteButtons = null;
        if ((this.props.features.length > 0) && (this.props.drawStatus !== "start")) {
            selectDeleteButtons = (
                <ButtonGroup justified>
                    <Button href="#" onClick={this.invertFeatureSelection}>
                        <Message msgId="zmf.buttons.invertSelection"/>
                    </Button>
                    <Button href="#" onClick={this.selectAllFeatures}>
                        <Message msgId="zmf.buttons.selectAll"/>
                    </Button>
                    <Button href="#" onClick={this.deleteSelectedFeatures} bsStyle="danger"
                    disabled={this.props.features.filter((f) => f.selected).length > 0 ? "" : "disabled"}>
                        <Message msgId="zmf.buttons.deleteSelected"/>
                    </Button>
                </ButtonGroup>
            );
            featureSelection = (
                <div>
                <Panel header={<h4><Message msgId="zmf.featurelist.header"/></h4>}
                footer={selectDeleteButtons}>
                    <ListGroup fill>
                            {this.props.features.map(f => {
                                return (
                                    <Feature feature={f} handleSelect={this.toggleSelection} onStyleChange={this.updateFeatureStyleRule}/>
                                )
                            })}
                    </ListGroup>
                </Panel>
                </div>
            );
        }
        return (
            <div role="body" className="scrollable">
                <ButtonGroup justified>
                    {this.props.drawMethods.map(method => {
                        return (
                            <Button href="#" onClick={()=>this.setDrawMethod(method)}
                            bsStyle={this.statusForDrawMethod(method) ? "info" : "default"}>
                                <Message msgId={"draw." + method}  />
                            </Button>
                        )
                    })}
                </ButtonGroup>
                {featureSelection}
                <h4>{this.props.drawStatus}</h4>
            </div>
        )
    }
    render() {
        let assetsPath = ConfigUtils.getConfigProp("assetsPath");
        return (
            <SideBar id="ZMF"  width="40em" height="100%"
                title="appmenu.items.ZMF" icon={assetsPath + "/img/share_white.svg"}>
                {this.renderBody()}
            </SideBar>
        );
    }
}

ZMF.propTypes = {
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
}

ZMF.defaultProps = {
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
