import React from 'react';

import SearchBar from './SearchBar'
import {
    Navbar,
    NavbarBrand
} from "reactstrap";

export default class HeaderBanner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">Green City Index</NavbarBrand>
                <SearchBar />
            </Navbar>
        );
    }
}
