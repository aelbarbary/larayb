import React from 'react';
import ReactDOM from 'react-dom';
import OfferForm from '../../../../components/Offer/Form';

jest.mock("react-ga")

const historyMock = { push: jest.fn() };

const locationMock = { state: { user: {userId: 1} } };
const matchMock = { params: {}}

// const {user} =this.props.location.state;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OfferForm history={historyMock} location={locationMock} match={matchMock}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
