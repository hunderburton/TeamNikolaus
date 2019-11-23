import React from 'react';

import ReactMapGL, { Source, Layer } from 'react-map-gl';

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
      data: {
        "type": "FeatureCollection",
        "features": []
      },
      token: "pk.eyJ1IjoidGVhbW5pa29sYXVzIiwiYSI6ImNrM2FlYmVvNzBheDIzb21yc25xM2tqejYifQ.X50fYA7cIFaTb7Blk_IOtA"
    };
    this.getIndexData();
  }

  calculateBoundingBox() {
    var longitude = this.state.viewport.longitude;
    var latitude = this.state.viewport.latitude;
    var offset = 0.01;
    return {
      eastFrom: longitude - offset,
      northFrom: latitude - offset,
      eastTo: longitude + offset,
      northTo: latitude + offset,
      resolution: 100,
    }
  }

  async getIndexData() {
    var boundingBox = this.calculateBoundingBox();
    var query = `http://localhost:5000/query?`
      + `eastFrom=${boundingBox.eastFrom}&northFrom=${boundingBox.northFrom}&`
      + `eastTo=${boundingBox.eastTo}&northTo=${boundingBox.northTo}&`
      + `res=${boundingBox.resolution}`;
    try {
      const response = await fetch(query);
      const responseJson = await response.json();
      this.setState({ data: responseJson });
    }
    catch (error) {
      return console.error(error);
    }
  }

  onViewportChange = viewport => {
    this.setState({ viewport });
    this.getIndexData();
  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken={this.state.token}
        onViewportChange={(viewport) => this.onViewportChange(viewport)}
      >
        {
          <Source type="geojson" data={this.state.data}>
            <Layer {...heatmapLayer} />
          </Source>
        }
      </ReactMapGL>
    );
  }
}

const MAX_ZOOM_LEVEL = 20;

export const heatmapLayer = {
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'heatmap',
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'index'], 1, 10, 10, 1],
    'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
      0.00, 'rgba(0,0,0,0)',
      0.25, 'rgba(255,128,0,0.5)',
      0.50, 'rgba(255,255,0,0.5)',
      0.75, 'rgba(128,255,0,0.5)',
      1.00, 'rgba(0,255,0,0.5)'
    ],
    //'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
    // Increase the heatmap color weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    //'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
    // Adjust the heatmap radius by zoom level
    //'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
    // Transition from heatmap to circle layer by zoom level
    // 'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
  }
};
