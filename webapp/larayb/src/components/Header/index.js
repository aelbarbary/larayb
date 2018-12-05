import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'
import './styles.sass';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.previousWidth = 0;
    this.menuButton = (
      <button className="menuBtn"
        onClick={
          () => {
            document.querySelector(".menu").classList.toggle("open");
          }
        }
      >
        MENU
      </button>
    );

    this.loggedInMenu = (
      <div className="menu">

        <Link key={4} to="/login" className="navLink">
          Login
        </Link>
      </div>
    );

    this.loggedOutMenu = (
      <div className="menu loginMenu">
        <Link key={5} className="navLink" to="/login">
          LogIn / Sign Up
        </Link>
      </div>
    );

    this.setNav();
    this.setMenuState(window.innerWidth);
    this.previousWidth = window.innerWidth;

  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setMenuState(window.innerWidth);
    });
  }

  setMenuState(width) {
    if (this.previousWidth !== width) {
      if (width > 768) {
        const menu = document.querySelector('div.menu');
        if(menu) {
          menu.classList.remove("open");
        }
        this.setState({menuActive: false});
      } else {
        this.setState({menuActive: true});
      }
      this.previousWidth = width;
    }
  }

  setNav() {
    // check for auth here
    const True = false;
    if (True) {
      this.setState({ nav: this.loggedInMenu });
    } else {
      this.setState({ nav: this.loggedOutMenu });
    }
  }

  render() {
    return (
      <header className="header">
        <img src={logo} width='75px' height='75px' alt='logo'></img>
        <h1>
          <Link  to="/" className="logo">
            LARAYB
          </Link>
        </h1>
        {this.state.menuActive ? this.menuButton: ""}
        {this.state.nav}
      </header>
    );
  }
}

export default Header;
