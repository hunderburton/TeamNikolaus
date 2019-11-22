import React from 'react';

import ReactMapGL, {Source, Layer}  from 'react-map-gl';
import {heatmapLayer} from './heatmap-style';

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
      }, data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              id: "co20",
              index: 6,
            },
            geometry: {
              type: "Point",
              coordinates: [13.402254, 52.520008, 0.0]
            }
          },
          {
            type: "Feature",
            properties: {
              id: "co20",
              index: 6,
            },
            geometry: {
              type: "Point",
              coordinates: [13.403254, 52.520008, 0.0]
            }
          },
          {
            type: "Feature",
            properties: {
              id: "co20",
              index: 6,
            },
            geometry: {
              type: "Point",
              coordinates: [13.403254, 52.51900, 0.0]
            }
          },
          {
            type: "Feature",
            properties: {
              id: "co20",
              index: 600,
            },
            geometry: {
              type: "Point",
              coordinates: [13.402254, 52.51900, 0.0]
            }
          }

        ]
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
      >
        {this.state.data && (
          <Source type="geojson" data={this.state.data}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
      </ReactMapGL>
    );
  }
}