import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMapGL from 'react-map-gl';
import { 
  Input, 
  Label, 
  Navbar,
  Collapse,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  InputGroup, 
  InputGroupAddon, 
  Button
} from "reactstrap";


class HeaderBanner extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { isOpen: true }
  }

  toggle() {
    this.state.isOpen = !this.state.isOpen;
  }       

  render() {
    return (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Team Nikolaus</NavbarBrand>
        <NavbarToggler onClick={this.toggle}/>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
          <InputGroup>
            <Input />
            <InputGroupAddon addonType="append">
              <Button color="secondary">Search</Button>
            </InputGroupAddon>
          </InputGroup>
          </Nav>
        </Collapse>
      </Navbar>
      );
    }
}

class MapDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 1000,
        height:500,
        latitude: 52.520008,
        longitude: 13.402254,
        zoom: 13
      },
      token: "pk.eyJ1IjoidGVhbW5pa29sYXVzIiwiYSI6ImNrM2FlYmVvNzBheDIzb21yc25xM2tqejYifQ.X50fYA7cIFaTb7Blk_IOtA"
    };
  }
  
  render() {
    return (
      <div>  
        <ReactMapGL mapboxApiAccessToken={this.state.token}
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
        />
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <header>
        <HeaderBanner /> 
      </header> 
      <MapDisplay />
    </div>
  );
}

export default App;
