import React from 'react';

import SearchBar from './SearchBar'
import {
    Navbar,
    NavbarBrand
} from "reactstrap";

export default class HeaderBanner extends React.Component {
    render() {
        const onSearchItemSelected = this.props.onSearchItemSelected;
        return (
            <Navbar style={{ height: "50px" }} color="dark" dark expand="md">
                <NavbarBrand href="/">Green City Index</NavbarBrand>
                <SearchBar 
                    onSearchItemSelected={onSearchItemSelected}
                    mapBoxToken={this.props.mapBoxToken}
                />
            </Navbar>
        );
    }
}
