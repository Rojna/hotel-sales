import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons'

import {GLOBALHEADER_MESSAGE} from "../constants/index";
import logo from "../images/Accor-Plus-logo_2019.png";


class Header extends React.Component  {


    render() {
        const {hasGlobalMessage, showLeaderBoard, handleLeaderBoard} = this.props;
        return (
            <div>
                <div className="d-flex justify-content-between container my-3">
                    <img src={logo} width="200" alt="Accor Plus Logo"/>
                    {showLeaderBoard && (
                        <button className="btn btn-primary" onClick={handleLeaderBoard}>
                            <FontAwesomeIcon icon={faListUl}/> Leader Board
                        </button>
                    )}
                </div>
                <div className="d-flex justify-content-center align-items-center banner">
                    {hasGlobalMessage && 
                        <h1>{GLOBALHEADER_MESSAGE}</h1>
                     }
                </div>
            </div>
        );
    }
}

export default (Header);