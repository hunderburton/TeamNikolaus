import React from 'react';
import { AsyncTypeahead } from 'reactstrap-typeahead';
import PropTypes from 'prop-types';
import MapboxClient from 'mapbox';


export default class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowNew: false,
      isLoading: false,
      multiple: false,
      options: [],
    };
    this.debounceTimeout = null;
    this.client = new MapboxClient(props.mapBoxToken);
  }


  onSearch = (value) => {
    const { timeout, localGeocoder, limit, localOnly } = this.props;
    const queryString = value;
    this.setState({ isLoading: true });
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      const localResults = localGeocoder ? localGeocoder(queryString) : [];
      const queryParams = {
        types: "country,place,region,district,postcode,neighborhood"
      }
      const params = { ...queryParams, ...{ limit: limit - localResults.length } };

      if (params.limit > 0 && !localOnly && queryString.length > 0) {
        this.client.geocodeForward(queryString, params).then((res) => {
          this.setState({
            isLoading: false,
            options: [...localResults, ...res.entity.features]
          });
        });
      } else {
        this.setState({
          isLoading: false,
          options: localResults
        });
      }
    }, timeout);

  }

  render() {
    const onChange = this.props.onChange;
    return (

      <AsyncTypeahead
        {...this.state}
        minLength={3}
        className="Span-header"
        labelKey="place_name"
        onSearch={this.onSearch}
        filterBy={["place_name"]}
        multiple={this.state.multiple}
        onChange={onChange}
        placeholder="Enter a location..."

      />
    );
  }
}
SearchField.propTypes = {
  timeout: PropTypes.number,
  queryParams: PropTypes.object,
  transitionDuration: PropTypes.number,
  hideOnSelect: PropTypes.bool,
  pointZoom: PropTypes.number,
  mapBoxToken: PropTypes.string.isRequired,
  formatItem: PropTypes.func,
  className: PropTypes.string,
  inputComponent: PropTypes.func,
  itemComponent: PropTypes.func,
  limit: PropTypes.number,
  localGeocoder: PropTypes.func,
  localOnly: PropTypes.bool,
  updateInputOnSelect: PropTypes.bool,
  initialInputValue: PropTypes.string
};

SearchField.defaultProps = {
  timeout: 300,
  transitionDuration: 0,
  hideOnSelect: false,
  updateInputOnSelect: false,
  pointZoom: 16,
  formatItem: item => item.place_name,
  queryParams: {
    types: "country"
  },
  className: '',
  limit: 5,
  initialInputValue: ''
};

