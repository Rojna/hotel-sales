import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import Header from './Header';
import Benefits from './Benefits.js';

import { getUrl, getFromSession } from './Helper.js';
import { PRICELEVEL_DISCOUNT, PRICELEVEL_DISCOUNT_NZ, PRICELEVEL_DISCOUNT_TH } from './../constants/index';

class EmployeeDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showError : false,
            staffName : '',
            staffId   : ''
        };
    }

    componentWillMount = () => {
        if(localStorage.getItem('hotelData') && this.props.history.location.state.language){
            const hotelData = JSON.parse(localStorage.getItem('hotelData'));
            this.setState({
                countryCode        : hotelData.countryCode
            });
        }else{
            window.location.href = "/";
        }
    }

    handleNext = () => {
        const {staffName, staffId, countryCode} =this.state;
        const { state } = this.props.history.location;
        const urlRoot = getUrl().urlRoot;
        var priceLevel;
        if(!staffName){
            this.setState({showError: true});
        }else{
            if(countryCode == "AU") {
                priceLevel = "&pricelevel=" + PRICELEVEL_DISCOUNT;
            } else if(countryCode == "NZ") {
                priceLevel = "&pricelevel=" + PRICELEVEL_DISCOUNT_NZ;
            } else if(countryCode == "TH") {
                priceLevel = "&pricelevel=" + PRICELEVEL_DISCOUNT_TH;
            }

            const url =  urlRoot + getFromSession("countryCode") + "/registration?hotelRIDOnlineKiosk="+state.hotelCode+"&apHotelEmployeeName="+staffName+"&hotelEmployee="+staffName + "&apHotelEmployeeId="+ staffId + priceLevel;
            console.log("URL", url);
            window.location.href = url;
        }
    };

    handleChange = (e) => {
        console.log(e);
        const key = e.target.name;
        const value = e.target.value;
        this.setState({ [key]: value });
    };


    render() {
        const { state } = this.props.history.location;
        const { showError, staffName, staffId } = this.state;
        return (
            <div className="hotelSales-wrapper">
                <Header />
                <div className="container mt-5">
                    <div>
                        <h4>{state.language.welcome}</h4>
                        <p>{state.language.beforeWeGetStarted}</p>
                        <p>{state.language.toAssist}</p>
                    </div>
                    <div>
                        <h4>{state.language.supplliedDetails}</h4>
                        <p><strong>{state.language.employeeType}: </strong>{state.language.hotelHeartist}</p>
                        <p><strong>{state.language.hotelDetails}:</strong> {state.hotelName} -RID {state.hotelCode}</p>
                    </div>

                    <div>
                        <h4>{state.language.yourDetails} <sup>*</sup></h4>
                        <p>{state.language.pleaseProvide}</p>
                    </div>

                    <div className="hotel-code-container row">
                        <div className="form-group col-12 col-md-6">
                            <label for="staffName">
                                {state.language.heartistName}<sup>*</sup>
                            </label>
                            <input 
                                name        = "staffName"
                                type        = "text" 
                                placeholder = {state.language.enterStaffName}
                                className       = {`form-control ${showError ? ' border border-danger' : ''}`} 
                                value       = {staffName} 
                                onChange    = {this.handleChange} />
                            {showError && (
                                <div className="error">{state.language.missingEmployee}</div>
                            )}
                        </div>

                        <div className="form-group col-12 col-md-6">
                            <label for="staffId">
                                {state.language.yourstaffID}
                            </label>
                            <input 
                                name        = "staffId" 
                                type        = "text" 
                                placeholder = {state.language.enterStaffID} 
                                className   = "form-control"
                                value       = {staffId} 
                                onChange    = {this.handleChange} />
                        </div>
                    </div>

                    <div className="mt-2">
                        <p>{state.language.whyWeNeedThis}</p>
                    </div>

                    <div className="d-flex justify-content-between">
                        <p class="disclaimer">*mandatory question{state.language.employeeType}</p>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary" onClick={()=> this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft} /> {state.language.back}</button>
                        <button className="btn btn-primary" onClick={this.handleNext}>{state.language.next} <FontAwesomeIcon icon={faChevronRight} /></button>
                    </div>
                </div>
            
                <Benefits data = {state.benefitResults}/>
            </div>
        );
    }

}

export default EmployeeDetail;
