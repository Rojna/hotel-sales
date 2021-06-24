import React, {Component} from 'react';
import axios from 'axios';
import {HOTELSEARCH_CODEURL} from './../constants/index';
import Header from './Header';
import HotelSearchModal from './HotelSearchModal';
// import Posts from './Posts';
// import EmployeeDetail from "./EmployeeDetail";

import checkbox from "../images/check_box-24px 1.png";
import '../css/style.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show               : false,
            hotelSearch        : false,
            hotelSearchResults : false,
            countryCode        : '',
            edYpos             : '',
            hotelCode          : '',
            hotelName          : '',
        };
        this.showModal       = this.showModal.bind(this);
        this.hideModal       = this.hideModal.bind(this);
        this.save = this.save.bind(this);
    }

    showModal = (e) => {
        e.preventDefault();
        this.setState({ show: true });
      };
    
      hideModal = () => {
        this.setState({ show: false });
      };

    handleClick = () => {
        axios.get(`${HOTELSEARCH_CODEURL}?HotelCode=${this.state.hotelCode}`)
            .then(response => {
                console.log(response.data[0].HotelCode);
                if (response.status === 200) {
                    this.setState({
                        hotelSearch        : true,
                        hotelSearchResults : true,
                        hotelCode          : response.data[0].HotelCode,
                        hotelName          : response.data[0].HotelName
                    });
                    localStorage.setItem('hotelData',JSON.stringify(response.data[0]));
                } else throw new Error('Oops, something went wrong');
            }).catch(error => {
                this.setState({
                    hotelSearch        : true,
                    hotelSearchResults : false
                });
        });
    };

    handleChange = (e) => {
        this.setState({hotelCode: e.target.value});
    };

    save = (hotelCode) => {
        this.setState({hotelCode: hotelCode});
        this.handleClick();
    }

    render() {
        const {hotelSearch, hotelSearchResults, hotelName, hotelCode, show} = this.state;
        return (
            <div className="hotelSales-wrapper">
                <Header />
                <div className="hotelSales-hotelDetails container">
                <div className="hotelSales-welcomeMsg mt-5">
                    <div className="">
                        <h4>Welcome to Accor Plus' Loyalty Plus hotel sales</h4>
                        <p>Before we get started, there are 3 short questions to ensure we have all the needed detail to successfully complete the membership enrolment.</p>
                        <p>To assist the guest with the appropriate product selection, please see below our key Accor Plus membership benefits.</p>
                    </div>
                    <div className="">
                        <h4>Supplied details</h4>
                        <p>Employee type: Hotel Heartist</p>
                    </div>
                </div>
      
                <h4>Hotel details <sup>*</sup></h4>
                <p>Please provide your hotel details for sales tracking</p>

                <div className="hotel-code-container row">
                    <div className="form-group col-12 col-md-6">
                        <label className="ridCode">Hotel RID code <sup>*</sup></label>
                        <input type="text" placeholder="Enter RID Code" className="form-control" required value={hotelCode} onChange={this.handleChange}/>
                        <div className="error">Enter the RID Code here. <a onClick= {this.showModal} href="#">Click here to perform a search</a>.</div>
                        <button className="btn btn-secondary mt-4" onClick={this.handleClick}>Check</button>
                    </div> 

                    {hotelSearch && !hotelSearchResults && (
                        <div className="hotel-results-container col-12 col-md-6">
                            <h5>Result</h5>
                            <div class="mt-3">
                                No results. <a onClick= {this.showModal} href="#">Click here to search the hotel.</a>
                            </div>
                            </div>
                    )}
                    
                    {hotelSearch && hotelSearchResults && hotelName && hotelCode && (
                        <div className="hotel-results-container col-12 col-md-6">
                            <h5>Result</h5>
                            <div class="mt-3">
                                <img src={checkbox} width="25"/> {hotelName} - {hotelCode}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    <p>Don't know your hotel code? <a onClick= {this.showModal} href="#">Click here to perform a search</a></p>
                </div>

                <div className="d-flex justify-content-between">
                <p className="disclaimer">*mandatory question</p>
                <button id="btnNext" type="button" className="btn btn-primary">Next ></button>
                </div>

            </div>
            <HotelSearchModal 
                show        ={show}  
                title       = {'Hotel details'} 
                instruction = {'Please provide your hotel name for a search'} 
                search      = {'Search'}
                submit      = {'Save and Apply'} 
                result      = {'RESULTS'} 
                handleClose = {this.hideModal} 
                save        = {this.saveHotelSearch} />
        </div>
        );
    }
}

export default (Home);
