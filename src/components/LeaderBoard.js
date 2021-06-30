import React, {Component} from 'react';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Tabs, Tab } from "react-bootstrap";

import '../css/style.css';

class LeaderBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLeaderBoard    : false,
        };

    }

    render() {
        const {showLeaderBoard} = this.state;
        return (
            <div className="hotelSales-wrapper">
                <Header 
                    showLeaderBoard   = {showLeaderBoard} 
                    hasGlobalMessage/>
                
                <div className="container">
                    <button className="btn btn-primary" onClick={()=> this.props.history.goBack()}>
                        <FontAwesomeIcon icon={faChevronLeft} /> Back
                    </button>
                    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="home" title="Home">
                        <p>Home</p>
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        <p>Profile</p>
                    </Tab>
                    <Tab eventKey="contact" title="Contact" >
                        <p>Contact</p>
                    </Tab>
                    </Tabs>
                </div>
        </div>
        );
    }
}

export default (LeaderBoard);
