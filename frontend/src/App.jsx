import React from 'react';
import HeaderBanner from './components/HeaderBanner';
import MapDisplay from './components/MapDisplay'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

import { Container, Row } from 'reactstrap';

function App() {
  return (
    <Container fluid={true}>
      <HeaderBanner />
      <MapDisplay />
    </Container>
  );
}

export default App;
