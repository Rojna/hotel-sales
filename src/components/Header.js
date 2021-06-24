import React from 'react';
import {GLOBALHEADER_MESSAGE} from "../constants/index";
import logo from "../images/Accor-Plus-logo_2019.png";


class Header extends React.Component  {
    render() {
        const {hasGlobalMessage} = this.props;
        return (
            <div>
                <div className="d-flex justify-content-between container my-3">
                    <img src={logo} width="200" alt="Accor Plus Logo"/>
                    <button id="btnLeaderBoard" type="button" className="btn btn-primary d-none">
                        <i className="fas fa-clipboard-list"></i> Leader Board
                    </button>
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