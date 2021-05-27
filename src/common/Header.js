
import {GLOBALHEADER_MESSAGE} from "../constant";

const Header = (props) => { 
    return (
        <div>
            <div className="d-flex justify-content-between container">
                <img src="../images/Accor-Plus-logo_2019.png" width="200" alt="Accor Plus Logo"/>
                <button id="btnLeaderBoard" type="button" className="btn btn-primary d-none">
                    <i className="fas fa-clipboard-list"></i> Leader Board
                </button>
            </div>
            <div className="d-flex justify-content-center align-items-center banner">
                {props.hasGlobalMessage && 
                    <h1>{GLOBALHEADER_MESSAGE}</h1>
                 }
            </div>
        </div>
    )
}
  
export default Header;