import React from 'react';

import {
    Input,
    InputGroup,
    InputGroupAddon,
    Button
} from "reactstrap";

export default class HeaderBanner extends React.Component {
    render() {
        return (
            <InputGroup>
                <Input />
                <InputGroupAddon addonType="append">
                    <Button color="secondary">Search</Button>
                </InputGroupAddon>
            </InputGroup>
        );
    }
}
