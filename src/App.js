import React, { useState, useEffect } from 'react';
import Header from "./common/Header";
import Welcome from "./common/Welcome";
import {HOTELSEARCH_CODEURL} from "./constant";

function App() {
  // Declare a new state variable, for Hotel Details
  // Declare multiple state variables!
  const [hotelData, setHotelData] = useState();
  const [countryCode, setCountryCode] = useState();
  const [edYpos, setEdYpos] = useState();
  const [hotelSearchResults, sethotelSearchResults] = useState();

  let hotelCode = React.createRef();  // React use ref to get input value

  const checkHotel = () => {  
    console.log(hotelCode.current.value); 
    fetch(
      `${HOTELSEARCH_CODEURL}?HotelCode=${hotelCode.current.value}`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/vnd.github.cloak-preview"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        console.log(response)
        if(!response.errorMessage){
          setHotelData(response)
          sethotelSearchResults(1)
        } else{
          sethotelSearchResults(0)
        }
      
      })
      .catch(error =>{
        console.log(error);
      });

};

  return (
    <div className="hTSales">
      <Header />
      <div className="hTSales-hotelDetails container">
        <Welcome />
      
        <h4>Hotel details <sup>*</sup></h4>
        <p>Please provide your hotel details for sales tracking</p>

        <div className="hotel-code-container row">
          <div className="form-group col-12 col-md-6">
            <label className="ridCode">Hotel RID code <sup>*</sup></label>
              <input ref={hotelCode} type="text" placeholder="Enter RID Code" className="form-control" required/>
              <div className="error">Enter the RID Code here. <a data-toggle="modal" data-target="#hotelSearchModal" href="#">Click here to perform a search</a>.</div>
              <button className="btn btn-secondary mt-4" onClick={checkHotel}>Check</button>
            </div>
            HotelSearch :  {hotelSearchResults}
            HotelDAte : {hotelData}
            {hotelSearchResults && hotelSearchResults === 0 && (
              <div className="hotel-results-container col-12 col-md-6">
                <h5>Result</h5>
                <div class="mt-3">
                  No results. <a data-toggle="modal" data-target="#hotelSearchModal" href="#">Click here to search the hotel.</a>
                </div>
              </div>
            )}

            {hotelSearchResults && hotelSearchResults === 1 && hotelData && (
              <div className="hotel-results-container col-12 col-md-6">
                <h5>Result</h5>
                <div class="mt-3">
                  HOTEL HOTEL
                </div>
              </div>
            )}
          </div>

        <div className="mt-2">
            <p>Don't know your hotel code? <a data-toggle="modal" data-target="#hotelSearchModal" href="#">Click here to perform a search</a></p>
        </div>

        <div className="d-flex justify-content-between">
          <p className="disclaimer">*mandatory question</p>
          <button id="btnNext" type="button" className="btn btn-primary">Next ></button>
        </div>

      </div>
      
      {hotelData}
    </div>
  );
}

export default App;
