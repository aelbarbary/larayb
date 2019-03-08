import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import "./checkout-styles.css";
import {InsertPayment} from  '../../../actions/Payment.js';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {
	CardElement,
  StripeProvider,
  Elements,
  injectStripe,
} from  'react-stripe-elements';

const styles = theme => ({

});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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
          InsertPayment({token: token.id, amount:this.state.amount});
        })
        .catch((err) =>{
          console.log(err);
        })

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
          label="Amount"
          onChange={this.handleChange('amount')}
          type="number"
          className='amount'
          value={this.state.amount}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />

        <CardElement
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          onReady={handleReady}
          {...createOptions(this.props.fontSize)}
        />
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

  handleOpen = () => {
   this.setState({ open: true });
  };

  handleClose = () => {
   this.setState({ open: false });
  };

  componentWillMount(){
    const { open } = this.props;
    this.setState({open: open});
  }

  componentWillReceiveProps(props){
    const { open } = props;
    this.setState({open: open});
  }


  render() {
    const {elementFontSize} = this.state;
    const { classes } = this.props;
    return (
      <StripeProvider apiKey="pk_test_H8g8b1OnsdL16adsrvTHKVyW">
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
             <Toolbar>
               <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                 <CloseIcon />
               </IconButton>
               <Typography variant="h6" color="inherit" className={classes.flex}>
                 Checkout
               </Typography>

             </Toolbar>
           </AppBar>

          <div className="Checkout" >
            <h1>Please enter your card details</h1>
            <Elements>
              <CardForm fontSize={elementFontSize} />
            </Elements>
          </div>
        </Dialog>
      </StripeProvider>
    );
  }
}


Checkout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);
