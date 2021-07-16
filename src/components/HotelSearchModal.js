import React , {Component} from "react";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

import data from '../data/hotel-search.json';

class HotelSearchModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            searchedHotelName : '',
            searchResults     : [],
            showResults       : false,
            selectedHotelCode : 0
        };
    }

    handleClick = () => {
        var dataResults = data;
        dataResults = dataResults.filter((item) => item.HotelName.includes(this.state.searchedHotelName.toUpperCase()));
        console.log("Search criteria: " + this.state.searchedHotelName);
        console.log(dataResults);
        this.setState({
            searchResults : dataResults,
            showResults   : true
        });
    };

    handleChange = (e) => {
        this.setState({searchedHotelName: e.target.value});
    };

    handleResultClick = (hotelCode) => {
        this.setState({selectedHotelCode: hotelCode});
    }

    render() {
        const {show, language, handleClose, save} = this.props;
        const {searchedHotelName, searchResults, showResults} = this.state;
        var hotelResults;

        if(searchResults.length > 0 ){
            hotelResults = searchResults.map((item, index) =>
            <tr key={index} onClick={(e) => this.handleResultClick(item.HotelCode)}>
                <td> 
                    <input 
                        type="radio" 
                        name="hotelNameRadio"
                        value={item.HotelName + " - " + item.HotelCode} 
                        checked={this.state.selectedHotelCode === item.HotelCode} 
                        onChange={(e) => this.handleResultClick(item.HotelCode)}/>
                </td>
                <td><label>{item.HotelName} - RID {item.HotelCode}</label></td>
            </tr>
            );
        }
        return (
            <Modal show={show} onHide={handleClose}>
                <ModalHeader closeButton>
                    <ModalTitle>
                        <h4>{language.hotelDetails}<sup>*</sup></h4>
                    </ModalTitle>
                 </ModalHeader>
                <ModalBody>
                    <p>{language.pleaseProvideHotelName}</p>
                    <div className="row">
                        <div className="col-8 col-md-12">
                            <input id="hotelName" name="hotelName" type="text" placeholder="Enter the name of hotel" className="form-control" value={searchedHotelName} onChange={this.handleChange} />
                        </div>
                        <div className="col-4">
                            <button id="btnModalCheck" className="btn btn-secondary mt-md-4" onClick={this.handleClick}>{language.search}</button>
                        </div>
                    </div>

                    {showResults && searchResults.length > 0 &&(
                        <div className="hotelSearchModalResults mt-2">
                            <div className="row">
                                <div className="col-12 mb-2">
                                    <h4>{language.result}</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 ">
                                    <table className="table table-hover">
                                        <tbody>
                                            {hotelResults}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {showResults && searchResults.length == 0 &&(
                         <div className="row mt-2">
                            <div className="col-12">
                                <h4>No Results</h4>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <button onClick={handleClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={() => save(this.state.selectedHotelCode)} type="button" id="btnModalSubmit" className="btn btn-primary">{language.saveAndApply}</button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default (HotelSearchModal);