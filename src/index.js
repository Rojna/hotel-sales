import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';

import './css/bootstrap.min.css';

import Home from './components/Home';
import EmployeeDetail from './components/EmployeeDetail';
import LeaderBoard from './components/LeaderBoard';


ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/employee-details" component={EmployeeDetail}/>
            <Route path="/id" exact component={Home} />
            <Route path="/id/employee-details" exact component={EmployeeDetail}/>
            <Route path="/my" exact component={Home} />
            <Route path="/my/employee-details" exact component={EmployeeDetail}/>
            <Route path="/th" exact component={Home} />
            <Route path="/th/employee-details" exact component={EmployeeDetail}/>
            <Route path="/vn" exact component={Home} />
            <Route path="/vn/employee-details" exact component={EmployeeDetail}/>

            <Route path="/leaderboard" exact component={LeaderBoard}/>
        </Switch>
    </Router>
    , document.getElementById('root'));
    

