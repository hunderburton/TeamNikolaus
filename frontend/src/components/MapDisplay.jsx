import React from 'react';

import ReactMapGL, { Source, Layer, Marker } from 'react-map-gl';

import { FaHome } from 'react-icons/fa';

export default class MapDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight - 50,
        latitude: 49.8728,
        longitude: 8.6512,
        zoom: 15
      },
      data: {
        "type": "FeatureCollection",
        "features": []
      },
      token: "pk.eyJ1IjoidGVhbW5pa29sYXVzIiwiYSI6ImNrM2FlYmVvNzBheDIzb21yc25xM2tqejYifQ.X50fYA7cIFaTb7Blk_IOtA"
    };
  }

  calculateBoundingBox() {
    var bounds = this.mapRef.getMap().getBounds();
    return {
      latFrom: bounds._sw.lat,
      longFrom: bounds._sw.lng,
      latTo: bounds._ne.lat,
      longTo: bounds._ne.lng,
      resolution: 100,
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  markers = [];
  createMarkers() {
    var bounds = this.mapRef.getMap().getBounds();
    var amountOfMarkers = this.getRandomInt(5, 15);
    console.log(amountOfMarkers);
    this.markers = [];
    for (var i = 0; i < amountOfMarkers; i++) {
      var lat = this.getRandomFloat(bounds._sw.lat, bounds._ne.lat);
      var long = this.getRandomFloat(bounds._sw.lng, bounds._ne.lng);
      this.markers.push({ key: "Random-" + i, latitude: lat, longitude: long })
    }
    console.log(this.markers);
  }

  async getIndexData() {
    this.createMarkers();
    var boundingBox = this.calculateBoundingBox();
    var query = `http://localhost:5000/query?`
      + `latFrom=${boundingBox.latFrom}&lonFrom=${boundingBox.longFrom}&`
      + `latTo=${boundingBox.latTo}&lonTo=${boundingBox.longTo}&`
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

  componentDidMount() {
    this.getIndexData();
  }

  render() {
    const { viewport, data, token } = this.state;

    return (
      <ReactMapGL
        width='100%'
        height='100%'
        {...viewport}
        mapboxApiAccessToken={token}
        onViewportChange={(viewport) => this.setState({ viewport })}
        onMouseUp={() => this.getIndexData()}
        ref={map => this.mapRef = map}
      >
        {this.markers.map((marker) => <Marker {...marker}>
          <div><h2><FaHome /></h2></div>
        </Marker>)}
        <Source type="geojson" data={data}>
          <Layer {...heatmapLayer} />
        </Source>
      </ReactMapGL>
    );
  }
}

const MAX_ZOOM_LEVEL = 20;

export const heatmapLayer = {
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'heatmap',
  paint: {
    'heatmap-weight': {
      property: 'index',
      type: 'exponential',
      stops: [
        [0, 0],
        [1, 1]
      ]
    },
    'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
      0.00, 'rgba(255,0,0,0.1)',
      0.25, 'rgba(255,128,0,0.5)',
      0.50, 'rgba(255,255,0,0.5)',
      0.75, 'rgba(128,255,0,0.5)',
      1.00, 'rgba(0,255,0,0.5)'
    ],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 10, 15, 30]
    // Increase the heatmap color weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    //'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
    // Adjust the heatmap radius by zoom level
    //'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
    // Transition from heatmap to circle layer by zoom level
    // 'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
  }
};
