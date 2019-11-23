import React from 'react';

import SearchBar from './SearchBar'
import {
    Navbar,
    NavbarBrand
} from "reactstrap";
import SettingsButton from './SettingsButton';

export default class HeaderBanner extends React.Component {
    render() {
        const onSearchItemSelected = this.props.onSearchItemSelected;
        const configureLayers = this.props.configureLayers;
        const startingLayersConfig = this.props.startingLayersConfig;
        return (
            <Navbar style={{ height: "50px" }} color="dark" dark expand="md">
                <NavbarBrand href="/">Lively Space Index</NavbarBrand>
                <SearchBar 
                    onSearchItemSelected={onSearchItemSelected}
                    mapBoxToken={this.props.mapBoxToken}
                />
                <SettingsButton
                    buttonLabel="Settings"
                    configureLayers={configureLayers}
                    startingLayersConfig={startingLayersConfig}
                />
            </Navbar>
        );
    }
}
