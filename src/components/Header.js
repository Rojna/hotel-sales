import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import {GLOBALHEADER_MESSAGE} from "../constants/index";
import logo from "../images/Accor-Plus-logo_2019.png";

class Header extends React.Component  {

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
        const {hasGlobalMessage, showLeaderBoard, handleLeaderBoard, hideBanner, goBack} = this.props;
        return (
            <div>
                <div className="d-flex justify-content-between container my-3">
                    <img src={logo} width="200" alt="Accor Plus Logo"/>
                    {showLeaderBoard && (
                        <button className="btn btn-primary" onClick={handleLeaderBoard}>
                            <FontAwesomeIcon icon={faListUl}/> Leader Board
                        </button>
                    )}
                    {hideBanner &&(
                        <button className="btn btn-secondary" onClick={goBack}>
                            <FontAwesomeIcon icon={faChevronLeft} /> Back
                        </button>
                    )}
                </div>
                {!hideBanner && (
                    <div className="d-flex justify-content-center align-items-center banner">
                        {hasGlobalMessage && 
                            <h4>{GLOBALHEADER_MESSAGE}</h4>
                        }
                    </div>
                )}
            </div>
        );
    }
}

export default (Header);