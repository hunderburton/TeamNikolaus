import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  }
  
  render() {
    return (
      <div>
        This is a wonderful map
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
