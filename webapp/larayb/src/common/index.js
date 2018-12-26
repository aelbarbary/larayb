const FormatAddressHelper = (address, city, state, zip) => {
  var formattedAddress = "";
  if (address){
    formattedAddress += address + ", ";
  }
  if (city){
    formattedAddress += city + ", "
  }
  if (state){
    formattedAddress += state + " "
  }
  if (zip){
    formattedAddress += zip
  }

  return formattedAddress.trim(); 
}

export default FormatAddressHelper;
