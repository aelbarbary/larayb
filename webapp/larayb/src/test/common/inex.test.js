import React from 'react';
import ReactDOM from 'react-dom';
import FormatAddressHelper from '../../common';


it('format address correcly', () => {

  var formattedAddress = FormatAddressHelper("1407 140th pl sw", "Lynnwood", "WA", "98087")
  expect("1407 140th pl sw, Lynnwood, WA 98087").toEqual(formattedAddress);

  var formattedAddress = FormatAddressHelper("", "Lynnwood", "WA", "98087")
  expect("Lynnwood, WA 98087").toEqual(formattedAddress);

  var formattedAddress = FormatAddressHelper("", "", "WA", "98087")
  expect("WA 98087").toEqual(formattedAddress);

  var formattedAddress = FormatAddressHelper("", "", "WA", "")
  expect("WA").toEqual(formattedAddress);
});
