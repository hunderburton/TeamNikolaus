import React from 'react';
import ReactMapGL, { Source, Layer, Marker, NavigationControl, FullscreenControl } from 'react-map-gl';
import HeaderBanner from './HeaderBanner';
import { WebMercatorViewport } from 'viewport-mercator-project';
import { MdSchool } from 'react-icons/md';

const fullscreenControlStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

const navStyle = {
  position: 'absolute',
  top: 36,
  left: 0,
  padding: '10px'
};

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
      token: "pk.eyJ1IjoidGVhbW5pa29sYXVzIiwiYSI6ImNrM2FlYmVvNzBheDIzb21yc25xM2tqejYifQ.X50fYA7cIFaTb7Blk_IOtA",
      layers: [
        {
          type: "ndvi",
          label: "Vegetation Index",
          enabled: true
        },
        {
          type: "air",
          label: "Air Quality",
          enabled: true
        },
        {
          type: "temp",
          label: "Heat Spots",
          enabled: true
        }
      ]
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
  async getAmenities() {
    var boundingBox = this.calculateBoundingBox();
    var query = `http://localhost:5000/query/amenities`
      + `?latFrom=${boundingBox.latFrom}&lonFrom=${boundingBox.longFrom}`
      + `&latTo=${boundingBox.latTo}&lonTo=${boundingBox.longTo}`
      + `&amenities=school`;
    try {
      const response = await fetch(query);
      const responseJson = await response.json();
      for (const [key, value] of Object.entries(responseJson["school"])) {
        this.markers.push({
          key: Math.random(), latitude: Number(value.latitude), longitude: Number(value.longitude), tags: value.tags
        });
      }
    }
    catch (error) {
      return console.error(error);
    }
  }

  async getIndexData() {
    this.getAmenities();
    var boundingBox = this.calculateBoundingBox();
    var channels = "";
    for (var i = 0; i < this.state.layers.length; i++) {
      if (this.state.layers[i].enabled) {
        if (channels == "") {
          channels = this.state.layers[i].type;
        }
        else {
          channels = channels + "," + this.state.layers[i].type;
        }

      }
    }
    var query = `http://localhost:5000/query`
      + `?latFrom=${boundingBox.latFrom}&lonFrom=${boundingBox.longFrom}`
      + `&latTo=${boundingBox.latTo}&lonTo=${boundingBox.longTo}`
      + `&res=${boundingBox.resolution}`
      + `&channel=${channels}`;
    try {
      const response = await fetch(query);
      const responseJson = await response.json();
      this.setState({ ...this.state, data: responseJson });
    }
    catch (error) {
      return console.error(error);
    }
  }

  componentDidMount() {
    this.getIndexData();
  }

  onSearchItemSelected = (selected) => {
    if (selected.length > 0) {
      var newViewport = new WebMercatorViewport(this.state.viewport);
      const { bbox, center } = selected[0];

      if (bbox) {
        newViewport = newViewport.fitBounds([
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]]
        ]);
      } else {
        newViewport = {
          longitude: center[0],
          latitude: center[1]
        };
      }
      this.setState({ ...this.state, viewport: newViewport }, this.getIndexData);
    }
  }

  configureLayers = (layers) => {
    this.setState({ layers }, () => {
      this.getIndexData();
    });
  }

  render() {
    const { viewport, data, token } = this.state;

    return (
      <>
        <HeaderBanner
          onSearchItemSelected={this.onSearchItemSelected}
          mapBoxToken={token}
          configureLayers={this.configureLayers}
          startingLayersConfig={this.state.layers}
        />
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={token}
          onViewportChange={(viewport) => this.setState({ ...this.state, viewport })}
          onMouseUp={() => this.getIndexData()}
          ref={map => this.mapRef = map}
        >
          {this.markers.map((marker) => <Marker {...marker}>
            <div>
              <h2><MdSchool /></h2>
              <p>{marker.tags.name}</p>
            </div>
          </Marker>)}
          <Source type="geojson" data={data}>
            <Layer {...heatmapLayer} />
          </Source>
          <div className="fullscreen" style={fullscreenControlStyle}>
            <FullscreenControl />
          </div>
          <div className="nav" style={navStyle}>
            <NavigationControl />
          </div>
        </ReactMapGL>
      </>

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
      0.00, 'rgba(255,0,0,0.5)',
      0.25, 'rgba(255,128,0,0.5)',
      0.50, 'rgba(255,255,0,0.5)',
      0.75, 'rgba(128,255,0,0.5)',
      1.00, 'rgba(0,255,0,0.5)'
    ],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 1, 10, 5, 13, 30, 15, 90, 18, 500]
    // Increase the heatmap color weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    //'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
    // Adjust the heatmap radius by zoom level
    //'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
    // Transition from heatmap to circle layer by zoom level
    // 'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
  }
};
