import React from 'react';
import ReactDOM from 'react-dom';
import FormatAddressHelper, {FormatOfferDate, FormatOfferTime} from '../../common';
import moment from 'moment';

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

it('format offer date correcly', () => {
  const dateFormat = "MMM, DD YYYY";
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);


  var date = FormatOfferDate(today, today);
  expect(moment(today).format(dateFormat) ).toEqual(date);

  date = FormatOfferDate(today, tomorrow);
  var expected = moment(today).format(dateFormat) + " to " + moment(tomorrow).format(dateFormat);
  expect( expected  ).toEqual(date);

});

it('format offer time correcly', () => {
  const timeFormat = "hh:mm A";
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);

  var time = FormatOfferTime(today, today);
  expect(moment(today).format("hh:mm A") ).toEqual(time);

  time = FormatOfferTime(today, tomorrow);
  var expected = moment(today).format(timeFormat) + " to " + moment(tomorrow).format(timeFormat);
  expect( expected  ).toEqual(time);

});
