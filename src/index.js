import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';

import './css/bootstrap.min.css';

import Home from './components/Home';
// import EmployeeDetail from './components/EmployeeDetail';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" exact component={Home}/>
            {/* <Route path="/employee-details" component={EmployeeDetail}/> */}
        </Switch>
    </Router>
    , document.getElementById('root'));
    

