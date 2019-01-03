import React from 'react';
import ReactDOM from 'react-dom';
import OfferList from '../../../../components/Offer/List';

jest.mock("react-ga")

const historyMock = { push: jest.fn() };

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OfferList history={historyMock} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
