import React from 'react';
import ReactDOM from 'react-dom';
import {FormatAddressHelper, FormatOfferDate, FormatOfferTime, IsEmpty} from '../../common/CommonFormatMethods';
import moment from 'moment';

jest.mock("react-ga")

it('format address correcly', () => {

  var formattedAddress = FormatAddressHelper("1407 140th pl sw", "Lynnwood", "WA", "98087")
  expect("1407 140th pl sw, \nLynnwood, WA 98087").toEqual(formattedAddress);

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
  var datetime1 = new Date("2019-01-01 11:00");
  var datetime2 = new Date("2019-01-01 11:00");
  var datetime3 = new Date("2019-01-01 16:00");

  var time = FormatOfferTime(datetime1, datetime2);
  expect("11:00 AM").toEqual(time);

  time = FormatOfferTime(datetime1, datetime3);
  var expected = "11:00 AM to 04:00 PM";
  expect( expected  ).toEqual(time);

});

it('checks for empty correcly', () => {
  const value = "";

  var isEmpty = IsEmpty("");
  expect(true).toEqual(isEmpty);


});
