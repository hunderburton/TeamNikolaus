import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, CustomInput } from 'reactstrap';

export default class SettingsButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: props.startingLayersConfig,
            modal: false
        }
    }

    toggle = () => this.setState({modal: !this.state.modal});

    saveConfig = () => {
        this.toggle();
        this.props.configureLayers(this.state.layers);
    };

    toggleLayer = (changeEvent) => {
        const { name } = changeEvent.target;
        for (var i = 0; i < this.state.layers.length; i++) {
            if (this.state.layers[i].type == name) {
                this.state.layers[i].enabled = !this.state.layers[i].enabled;
            }
        }
        console.log(this.state.layers);
        this.setState({ layers: this.state.layers });
        console.log(name);
    };
    //toggleLayer 
    render() {
        const checkBoxes = this.state.layers.map(layer =>
            <CustomInput
                key={layer.type}
                type="switch"
                id={layer.type}
                name={layer.type}
                label={layer.label}
                checked={layer.enabled}
                onChange={this.toggleLayer}
            />)
        return (
            <div>
                <Button className="Settings" color="light" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Configure Layers</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                {checkBoxes}
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.saveConfig}>Save</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}