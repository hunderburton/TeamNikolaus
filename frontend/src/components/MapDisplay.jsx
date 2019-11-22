import React from 'react';

import ReactMapGL from 'react-map-gl';

export default class MapDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight,
        latitude: 52.520008,
        longitude: 13.402254,
        zoom: 13
      },
      token: "pk.eyJ1IjoidGVhbW5pa29sYXVzIiwiYSI6ImNrM2FlYmVvNzBheDIzb21yc25xM2tqejYifQ.X50fYA7cIFaTb7Blk_IOtA"
    };
  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken={this.state.token}
        onViewportChange={(viewport) => this.setState({ viewport })}
      />
    );
  }
}