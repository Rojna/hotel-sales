import React, {Component} from 'react';
import '../css/style.css';

class Default extends Component {
    render() {
        return (
        <div className="hotelSales-wrapper text-center mt-5">
            <img alt="Hotel Sales" src="./favicon.png"></img>
            <h4 className="mt-2"> Whoops !</h4>
            <p className="mt-2">404 Page Not Found</p>
            <a href="/" className="btn btn-primary"> Go to Hotel Sales </a>     
        </div>
        );
    }
}

export default (Default);
