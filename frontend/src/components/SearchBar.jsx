import React from 'react';
import SearchField from './SearchField';

export default class SearchBar extends React.Component {


    render() {
        const onSelect = this.props.onSearchItemSelected;
        return (
            <SearchField
                    onChange={onSelect}
                    mapBoxToken={this.props.mapBoxToken}
                />
                
        );
    }
}
