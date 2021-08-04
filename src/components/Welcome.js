import React from 'react';
import checkbox from "../images/check_box-24px 1.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight, faGlobe } from '@fortawesome/free-solid-svg-icons'


class Welcome extends React.Component  {
    constructor(props) {
        super(props);
        this.handleLanguageChange   = this.handleLanguageChange.bind(this);
    }
        
    handleLanguageChange = (e) =>{
        const selected = e.target.value;
        const url = selected === "au" ? "/" : "/"+selected;
        window.location.href = url;
    }

    render() {
        const {language, handleChange, showModal, showError, handleNext, handleClick, hotelCode, hotelName, hotelSearchResults, hotelSearch, translateLanguage, region} = this.props;
        return (
            <div className="hotelSales-hotelDetails container">
                <div class="row mt-3">
                    <div class="col-md-10 col-sm-9"></div>
                    <div class="col-12 col-md-2 col-sm-3">
                        <div className="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><FontAwesomeIcon icon={faGlobe} /></span>
                                </div>
                                <select className="form-control" onChange={this.handleLanguageChange}>
                                {translateLanguage.map((key) => <option value={key[0]} selected={region === key[0] ? true: false}>{key[1]}</option>)}
                                </select> 
                            </div>
                        </div>
                    </div>
                </div>  
            <div className="hotelSales-welcomeMsg mt-3">
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