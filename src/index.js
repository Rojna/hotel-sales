import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';

import Home from './components/Home';
import Default from './components/Default';
import EmployeeDetail from './components/EmployeeDetail';
import LeaderBoard from './components/LeaderBoard';
import LoadingScreen from './components/common/loading-screen'

import languages from './data/language-test.json';
import { getUrl } from './components/helper';

class App extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        languages : [],
        loading   : true
      }
      if(this.state.languages.length == 0){
        this.getLanguages();
      }
      this.createRoute = this.createRoute.bind(this);
      this.createRouteEmployeeDetails = this.createRouteEmployeeDetails.bind(this);
    }

    async getLanguages() {

      const googleApiURL = getUrl().googleApiUrl;
      await fetch(googleApiURL,
        {
          method: "get",
          dataType: 'json',
        })
      .then((res) => res.json())
      .then((data) => {
        console.log('data',data);
        localStorage.setItem('languages',JSON.stringify(data));
        this.setState({languages : data,
                      loading  : false});
      }).catch(err => {
        console.log(err);
        localStorage.setItem('languages',JSON.stringify(languages));
        this.setState({languages : languages,
          loading  : false });
      });

    }

    createRoute() {
      let routes = Object.entries(this.state.languages).map(([key, value]) => {
        console.log('key',key);
        return (
          <Route 
              key={key}
              path={`/${key}`}
              exact
              component={Home}
          />
        );
      });
      return routes;
    }

    createRouteEmployeeDetails() {
        let routes = Object.entries(this.state.languages).map(([key, value]) => {
          return (
            <Route
                key={`/${key}/employee-details`}
                path={`/${key}/employee-details`}
                exact
                component={EmployeeDetail}
            />
          );
        });
        return routes;
    }
    
  
    render() {
        const routes = this.createRoute();
        const routeEmployeeDetails = this.createRouteEmployeeDetails();

        if(this.state.loading === true){
          return (
            <LoadingScreen/>
          );
        }
        
        return (
            <Router>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/employee-details" component={EmployeeDetail}/>
                {routes}
                {routeEmployeeDetails}
                <Route path="/leaderboard" exact component={LeaderBoard}/>
                <Route component={Default} />
            </Switch>
        </Router>
        );
    }
  }
  
ReactDOM.render(<App />, document.getElementById('root'));
    

