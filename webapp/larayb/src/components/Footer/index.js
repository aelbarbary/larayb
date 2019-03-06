import React, { Component } from 'react';
import './footer.css';
import logo  from '../../assets/images/logo.png'
class Footer extends Component {


  render() {
    return (
      <footer className="footer-distributed">

  			<div className="footer-left">

  				<h3>LARAYB</h3>
          <img src={logo} alt="logo" width='30'/>

  				<p className="footer-links">
  					<a href="https://www.larayb.com">Home</a>
  					·
  					<a href="https://www.larayb.com/search?query=youth">Youth</a>
  					·
  					<a href="https://www.larayb.com/search?query=women">Sisters</a>
  					·
  					<a href="https://www.larayb.com/search?query=quran">Qur'an</a>
  					·
  					<a href="https://www.larayb.com/search?query=realestate">Real Estate</a>
  					·
  					<a href="https://www.larayb.com/search?query=catering">Catering</a>
  				</p>

  				<p className="footer-company-name">LARAYB &copy; 2019</p>
  			</div>

  			<div className="footer-center">

  				<div>
  					<i className="fa fa-map-marker"></i>
  					<p><span>1407 140th, PL SW</span> Lynnwood, WA</p>
  				</div>

  				<div>
  					<i className="fa fa-phone"></i>
  					<p>+1 206 5568092</p>
  				</div>

  				<div>
  					<i className="fa fa-envelope"></i>
  					<p><a href="mailto:a.elbarbary@larayb.com">a.elbarbary@larayb.com</a></p>
  				</div>

  			</div>

  			<div className="footer-right">

  				<p className="footer-company-about">
  					<span>About Larayb</span>
  					Find Muslims related events, programs and products near you.
  				</p>

  				<div className="footer-icons">

  					<a href="https://www.facebook.com/Larayb-349244325868650"><i className="fa fa-facebook"></i></a>
  					{/*<a href="#"><i class="fa fa-twitter"></i></a>
  					<a href="#"><i class="fa fa-linkedin"></i></a>
  					<a href="#"><i class="fa fa-github"></i></a>
            */}

  				</div>

  			</div>

  		</footer>
    );
  }
}


export default Footer;
