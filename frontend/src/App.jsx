import React from 'react';
import { Container } from 'reactstrap';

import MapDisplay from './components/MapDisplay'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';


function App() {
  return (
    <Container fluid={true}>
      <MapDisplay />
    </Container>
  );
}

export default App;
