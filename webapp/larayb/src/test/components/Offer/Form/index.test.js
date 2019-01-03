import React from 'react';
import ReactDOM from 'react-dom';
import OfferForm from '../../../../components/Offer/Form';

jest.mock("react-ga")

const historyMock = { push: jest.fn() };

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OfferForm history={historyMock} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
