import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import "./checkout-styles.css";
import {InsertPayment} from  '../../../actions/Payment.js';
import TextField from '@material-ui/core/TextField';
import {
	CardElement,
  StripeProvider,
  Elements,
  injectStripe,
} from  'react-stripe-elements';

const styles = theme => ({

});

const handleBlur = () => {
  console.log('[blur]');
};
const handleChange = (change) => {
  console.log('[change]', change);
};

const handleFocus = () => {
  console.log('[focus]');
};
const handleReady = () => {
  console.log('[ready]');
};

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

class _CardForm extends React.Component {

  state = {amount: 0}
  handleSubmit = (ev) => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then((payload) => {
          var token  = payload.token;
          // console.log('[token]', payload)
          console.log(token.id);
          InsertPayment({token: token.id, amount:this.state.amount});
        });

    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          id="standard-number"
          label="Cost"
          onChange={this.handleChange('amount')}
          type="number"
          className='amount'
          value={this.state.amount}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />

        <label>


          Card details
          <CardElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <button>Pay</button>
      </form>
    );
  }
}
const CardForm = injectStripe(_CardForm);

class Checkout extends React.Component {
  constructor() {
    super();
    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
    };
    window.addEventListener('resize', () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
        this.setState({elementFontSize: '14px'});
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== '18px'
      ) {
        this.setState({elementFontSize: '18px'});
      }
    });
  }

  render() {
    const {elementFontSize} = this.state;
    return (
      <StripeProvider apiKey="pk_test_H8g8b1OnsdL16adsrvTHKVyW">
        <div className="Checkout">
          <h1>Please enter your card details</h1>
          <Elements>
            <CardForm fontSize={elementFontSize} />
          </Elements>
        </div>
      </StripeProvider>
    );
  }
}


Checkout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);
