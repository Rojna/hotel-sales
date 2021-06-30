import React from 'react';
import checkbox from "../images/check_box-24px 1.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons'


class Welcome extends React.Component  {
    render() {
        const {language, handleChange, showModal, showError, handleNext, handleClick, hotelCode, hotelName, hotelSearchResults, hotelSearch} = this.props;
        return (
            <div className="hotelSales-hotelDetails container">
            <div className="hotelSales-welcomeMsg mt-5">
                <div>
                    <h4>{language.welcome}</h4>
                    <p>{language.beforeWeGetStarted}</p>
                    <p>{language.toAssist}</p>
                </div>
                <div>
                    <h4>{language.supplliedDetails}</h4>
                    <p>{language.employeeType}: {language.hotelHeartist}</p>
                </div>
            </div>
    
            <h4>{language.hotelDetails} <sup>*</sup></h4>
            <p>{language.pleaseProvide}</p>

            <div className="hotel-code-container row">
                <div className="form-group col-12 col-md-6">
                    <label className="ridCode">{language.hotelRIDCode} <sup>*</sup></label>
                    <input type="text" placeholder="Enter RID Code" className={`form-control ${showError ? ' border border-danger' : ''}`} required value={hotelCode} onChange={handleChange}/>
                    {showError && (
                        <div className="error">{language.enterRIDCode} <a onClick= {showModal} href="#">{language.clickHere}</a>.</div>
                    )}
                    <button className="btn btn-secondary mt-4" onClick={handleClick}>{language.check} <FontAwesomeIcon icon={faCheck} /></button>
                </div> 

                {hotelSearch && !hotelSearchResults && (
                    <div className="hotel-results-container col-12 col-md-6">
                        <h5>{language.result}</h5>
                        <div className="mt-3">
                            No results. <a onClick= {showModal} href="#">{language.clickHere}.</a>
                        </div>
                        </div>
                )}
                
                {hotelSearch && hotelSearchResults && hotelName && hotelCode && (
                    <div className="hotel-results-container col-12 col-md-6">
                        <h5>{language.result}</h5>
                        <div className="mt-3">
                            <img src={checkbox} width="25"/> {hotelName} -RID {hotelCode}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-2">
                <p>{language.dontKnowHotelCode} <a onClick= {showModal} href="#">{language.clickHere}</a></p>
            </div>

            <div className="d-flex justify-content-between">
                <p className="disclaimer">*{language.mandatoryQuestion}</p>
                <button 
                    className="btn btn-primary"
                    onClick={handleNext}>{language.next} <FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
        </div>
        );
    }
}

export default (Welcome);