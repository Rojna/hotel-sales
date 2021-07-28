import React, {Component} from 'react';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart } from 'react-minimal-pie-chart';

import axios from 'axios';
import LoadingScreen from './common/loading-screen'
import { Accordion, Card } from "react-bootstrap";

import Header from './Header';
import ErrorMessage from './common/errorMessage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faHotel, faIdCardAlt, faListOl,faSquare, faExclamation, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Tabs, Tab } from "react-bootstrap";
import _ from 'lodash';

import { VENDORAPI, MAP_COUNTRYCODES, GLOBALAPIHEADER } from './../constants/index';

import '../css/style.css';
import '../css/leaderboard.css';

var today = new Date();
var firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

class LeaderBoard extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            showLeaderBoard     : false,
            startDate           : firstDateOfMonth,
            endDate             : today,
            searchInput         : "",
            data                : [],
            filteredData        : [],
            employeeData        : [],
            country             : [],
            countryData         : [],
            countryFilteredData : [],
            global              : [],
            globalData          : [],
            globalFilteredData  : [],
            filterCountry       : [],
            countrySearch       : '',
            showGlobalError     : false,
            selected            : '',
            hotelDetails        : [],
            fetchingData        : true,
            dashboardData       : [],
            activeTab           : 0,
            employeeEndOfList   : false,
            countryEndOfList   : false,
            globalEndOfList   : false,
            fetchingEmployeeData : false,
            fetchingCountryData : false,
            fetchingGlobalData  : false,
            employeePage        : 1,
            countryPage         : 1,
            globalPage          : 1   
        };

    }

    componentDidMount() {
        const {startDate, endDate} = this.state;
        const {hotelCode} = this.props.location.state;
        let fetchEmployee, fetchGlobal, fetchDashboard;

        if(localStorage.getItem('hotelDetails') && localStorage.getItem('dashboardData')){
            const rid_code = JSON.parse(localStorage.getItem('hotelDetails')).rid_code;
            const hotelCode = JSON.parse(localStorage.getItem('hotelData')).HotelCode;
            if( rid_code != hotelCode){
                localStorage.removeItem('hotelDetails');
                localStorage.removeItem('dashboardData');
                localStorage.removeItem('employeeData');
                localStorage.removeItem('data');
                localStorage.removeItem('globalData');
                localStorage.removeItem('global');
                localStorage.removeItem('countryData');
                localStorage.removeItem('country');
                fetchDashboard = this.getDashboardData('monthly');
            } else{
                this.setState({
                    hotelDetails  : JSON.parse(localStorage.getItem('hotelDetails')),
                    dashboardData : JSON.parse(localStorage.getItem('dashboardData'))
            });
            }
        }else{
            fetchDashboard = this.getDashboardData('monthly');
        }

        if(localStorage.getItem('employeeData')){
            this.setState({
                employeeData : JSON.parse(localStorage.getItem('employeeData')), 
                data: JSON.parse(localStorage.getItem('data'))});
        }else{
            fetchEmployee = this.getEmployeeData(startDate, endDate, hotelCode);
        }

        if(localStorage.getItem('globalData')){
            this.setState({
                globalData : JSON.parse(localStorage.getItem('globalData')),
                global: JSON.parse(localStorage.getItem('global'))
            });
        }else{
            fetchGlobal = this.getGlobalData(startDate, endDate);
        }

        Promise.all([fetchEmployee, fetchGlobal, fetchDashboard]).then(() =>{
            if(localStorage.getItem('countryData')){
                this.setState({
                    countryData : JSON.parse(localStorage.getItem('countryData')),
                    country : JSON.parse(localStorage.getItem('country')),
                    fetchingData : false
                });
            }else{
                 this.getCountryData(startDate, endDate);
            }
        });
    }

    handleTypeChange = (event) =>{ 
        const type =  event.target.value ?? 'monthly';
        this.getDashboardData(type);
    }

    getDashboardData = async (type) => {
        const {startDate, endDate} = this.state;
        const {hotelCode} = this.props.location.state;

        await this.getHotelDetails(startDate, endDate, hotelCode);
        const subsidiary =  this.state.hotelDetails ?  this.state.hotelDetails.subsidiary : "";
        if(subsidiary){
            await axios.get(`${'https://api-uat.accorplus.com/v1/leaderboarddashboard?type='+type+'&subsidiary='+subsidiary+'&ridCode='+hotelCode}`, GLOBALAPIHEADER)
                .then(response => {
                    if (response.status === 200) {
                        if(response.data){
                            let result = response.data; 
                            result.membershipBreakdown['Accor Plus Traveller Membership'] = 2;
                            result.membershipBreakdown['Accor Plus Explorer Membership'] = 4;
                            this.setState({ 
                                dashboardData : result});
                            localStorage.setItem('dashboardData',JSON.stringify(result));
                        }
                        this.setState({fetchingData : false }); 
                    } else throw new Error('Oops, something went wrong');
                }).catch(error => {
                    console.log('error', error) 
                    this.setState({ showGlobalError : true , fetchingData : false });  
            });
        }
    }

    getHotelDetails = async (startDate, endDate, ridCode) => {
        let start = moment(startDate).format("DD/MM/YYYY");
        const end = moment(endDate).format("DD/MM/YYYY");
        start = "01/03/2020";
        await axios.get(`${VENDORAPI+'?start_date'+start+'&end_date='+end+'&page=1&ridCode='+ridCode}`, GLOBALAPIHEADER)
            .then(response => {
                if (response.status === 200) {
                    if(response.data && response.data.length > 0){
                        this.setState({ 
                            hotelDetails: response.data['0']});
                        localStorage.setItem('hotelDetails',JSON.stringify(response.data['0']));
                        return;
                    }
                    this.setState({fetchingData : false }); 
                } else throw new Error('Oops, something went wrong');
            }).catch(error => {
                console.log('error', error) 
                this.setState({ showGlobalError : true , fetchingData : false}); 
                return;
        });
    }

    getEmployeeData = async (startDate, endDate, ridCode, updatePage=false) => {
        let start = moment(startDate).format("DD/MM/YYYY");
        const end = moment(endDate).format("DD/MM/YYYY");
        let page =  1;
        if(updatePage){
            page = this.state.employeePage + 1;
            this.setState({employeePage : page});
        }
        start = "01/03/2020";
        let index = 1;
        if(page != "1"){
            index = ((page - 1) * 10) + 1;
            this.setState({fetchingEmployeeData : true});
        }

        await axios.get(`${'https://api-uat.accorplus.com/v1/employee?start_date='+start+'&end_date='+end+'&page='+page+'&ridCode='+ridCode}`, GLOBALAPIHEADER)
            .then(response => {
                if (response.status === 200) {
                    if(response.data && Object.keys(response.data).length > 0){
                        if(page !== 1 && response.data.employees['0'].length === 0){
                            this.setState({
                                fetchingEmployeeData : false,
                                employeeEndOfList : true});
                        } else if(response.data.employees['0'].length > 0) {
                            let oldEmployeeData = (page == 1 ? [] : this.state.data);
                            var sortedData = _.orderBy(response.data.employees['0'], ['unitsSold'],['desc']);
                            for(let i = 0; i < sortedData.length; i++){
                                let newData = sortedData[i];
                                newData.index = index++;
                                oldEmployeeData.push(newData); 
                            }
                            this.setState({
                                data                 : oldEmployeeData,
                                employeeData         : oldEmployeeData,
                                fetchingEmployeeData : false,
                                employeeEndOfList    : sortedData.length < 10 ? true : false
                            });
                            if(page === 1){
                                localStorage.setItem('employeeData',JSON.stringify(oldEmployeeData));
                                localStorage.setItem('data',JSON.stringify(oldEmployeeData));
                            }
                        }
                    }
                    
                } else throw new Error('Oops, something went wrong');
            }).catch(error => {
                console.log('error', error) 
                this.setState({ showGlobalError : true , fetchingData : false });  
        });
    }

    getCountryData = async (startDate, endDate, updatePage=false) => {
        let start = moment(startDate).format("DD/MM/YYYY");
        const end = moment(endDate).format("DD/MM/YYYY");
        let page =  1;
        if(updatePage){
            page = this.state.countryPage + 1;
            this.setState({countryPage : page});
        }
        start = "01/03/2020";
        let index = 1;
        if(page != "1"){
            index = ((page - 1) * 10) + 1;
            this.setState({fetchingCountryData : true});
        }
        const subsidiary =  this.state.hotelDetails ?  this.state.hotelDetails.subsidiary : "";
        if(subsidiary){
            await axios.get(`${VENDORAPI+'?start_date='+start+'&end_date='+end+'&page='+page+'&subsidiary='+subsidiary}`, GLOBALAPIHEADER)
            .then(response => {
                if (response.status === 200) {
                    if(page !== 1 && response.data.length === 0){
                        this.setState({countryEndOfList : true});
                    } else {
                        if(response.data && response.data.length > 0){
                            let oldCountryData = (page === 1 ? [] : this.state.country);
                            let countryData = response.data;
                            for(let i = 0; i < countryData.length; i++){ 
                                let newData = countryData[i];
                                newData.index = index++;
                                oldCountryData.push(newData); 
                            }
                            this.setState({ 
                                country             : oldCountryData,
                                countryData         : oldCountryData,
                                fetchingCountryData : false,
                                fetchingData        : false,
                                countryEndOfList    : countryData.length < 10 ? true : false
                            });
                            if(page === 1){
                                localStorage.setItem('countryData',JSON.stringify(oldCountryData));
                                localStorage.setItem('country',JSON.stringify(oldCountryData));
                            }
                            this.filterCountries(this.state.globalData);
                        }
                    }
                } else throw new Error('Oops, something went wrong');
            }).catch(error => {
                console.log('error', error) 
                this.setState({ 
                    showGlobalError : true,
                    fetchingData    : false
                });  
            });
        }
    }

    filterCountries = (data) => {
        const uniques = _.uniq(_.map(data, 'country'));
        let filterCounrty = [];
        uniques.map((item)=>{
            filterCounrty.push(MAP_COUNTRYCODES[item])
        })
        this.setState({filterCountry: filterCounrty });
    }

    getGlobalData = async (startDate, endDate, updatePage=false) => {
        let start = moment(startDate).format("DD/MM/YYYY");
        const end = moment(endDate).format("DD/MM/YYYY");
        let page =  1;
        if(updatePage){
            page = this.state.globalPage + 1;
            this.setState({globalPage : page});
        }
        start = "01/03/2020";
        let index = 1;
        if(page != "1"){
            index = ((page - 1) * 10) + 1;
            this.setState({fetchingGlobalData : true});
        }
        await axios.get(`${VENDORAPI + '?start_date='+start+'&end_date='+end+'&page='+page}`, GLOBALAPIHEADER)
            .then(response => {
                if (response.status === 200 ) {
                    if(page !== 1 && response.data.length === 0){
                        this.setState({globalEndOfList : true});
                    } else if(response.data.length > 0) {
                        let previousData = (page == 1 ? [] : this.state.global);
                        let globalData = [];
                        Object.entries(response.data).map((key, i) => {
                            const data = key[1];
                            globalData[i] = data;
                            globalData[i].index = index++
                            globalData[i].countryName = MAP_COUNTRYCODES[data.country]; 
                            previousData.push(globalData[i]);
                        });
                        this.setState({
                            globalData         : previousData,
                            global             : previousData,
                            fetchingGlobalData : false,
                            fetchingData       : false,
                            globalEndOfList    : response.data.length.length < 10 ? true : false
                        });
                        if(page === 1){
                            localStorage.setItem('global',JSON.stringify(previousData));
                            localStorage.setItem('globalData',JSON.stringify(previousData));
                        }
                    }
                } else throw new Error('Oops, something went wrong');
            }).catch(error => {
                console.log('error', error) 
                this.setState({ showGlobalError : true, fetchingData : false});  
        });
    }
    
    handleChange = event => {
        this.setState({ searchInput: event.target.value }, () => {
            console.log('search', this.state.searchInput);
          this.hotelSearch();
        });
      };
    
      hotelSearch = () => {
        let { searchInput, data } = this.state;
        if(searchInput){
            let filteredData = data.filter(value => {
                console.log(value);
            return (
                (value.employeeID && value.employeeID.toLowerCase().includes(searchInput.toLowerCase())) ||
                searchInput.match(value.unitsSold)
              );
            });
            this.setState({ filteredData : filteredData });
        } else {
            this.setState({ filteredData : [] });
        }
        
    };

    handleCountrySearch = event => {
        this.setState({ searchInput: event.target.value }, () => {
            console.log('countrysearch', this.state.searchInput);
          this.counrtySearch();
        });
    };

    counrtySearch = () => {
        let { searchInput, countryData } = this.state;
        if(searchInput){
            let filteredData = countryData.filter(value => {
                console.log(value);
            return (
                value.vendorName.toLowerCase().includes(searchInput.toLowerCase()) ||
                searchInput.match(value.rid_code) || searchInput.match(value.unitsSold)
              );
            });
            this.setState({ countryFilteredData : filteredData });
        } else {
            this.setState({ countryFilteredData : [] });
        }
        
    };

    handleGlobalSearch = event => {
        this.setState({ searchInput: event.target.value }, () => {
            console.log('countrysearch', this.state.searchInput);
          this.globalSearch();
        });
    };

    globalSearch = () => {
        let { searchInput, globalData } = this.state;
        if(searchInput){
            let filteredData = globalData.filter(value => {
                console.log(value);
            return (
                value.vendorName.toLowerCase().includes(searchInput.toLowerCase()) ||
                searchInput.match(value.rid_code));
            });
            console.log(filteredData);
            this.setState({ globalFilteredData : filteredData });
        } else {
            this.setState({ globalFilteredData : [] });
        }
        
    };

    handleFilterCountrySearch = event => {
        this.setState({ countrySearch: event.target.value }, () => {
            console.log('countrysearch', this.state.countrySearch);
          this.filterCountrySearch();
        });
    }

    filterCountrySearch = () => {
        let { countrySearch, globalData } = this.state;
        if(countrySearch === 'all'){
            this.setState({ globalFilteredData : [] });
        } else {
            let filteredData = globalData.filter(value => {
                console.log(value);
            return (
                value.countryName.toLowerCase().includes(countrySearch.toLowerCase())
              );
            });
            this.setState({ globalFilteredData : filteredData });
        }
        
    };

    handleStartDate = (date) => {
        this.setState({startDate: date});
    }

    handleEndDate = (date) => {
        this.setState({endDate: date});
    }

    handleClick = (e) => {
        e.preventDefault();
        console.log("Clicked Search");
        const {startDate, endDate, activeTab} = this.state;
        const {hotelCode} = this.props.location.state;
        let start = moment(startDate).format("DD/MM/YYYY");
        const end = moment(endDate).format("DD/MM/YYYY");
        this.setState({fetchingData : true});
        const fetchEmployee = this.getEmployeeData(start, end, hotelCode, 1);
        const fetchCountry = this.getCountryData(start, end, 1);
        const fetchGlobal = this.getGlobalData(start, end, 1);
        Promise.all([ fetchEmployee, fetchCountry, fetchGlobal ]).then(() => {
            this.setState({fetchingData : false});
            this.filterCountries(this.state.globalData);
        });
    }

    getRanking = (index) => {
        switch(index) {
            case 1:
                return <img src="./images/first.png" width="35" alt="Accor Plus Logo"/>
            case 2:
                return <img src="./images/second.png" width="35" alt="Accor Plus Logo"/>
            case 3:
                return <img src="./images/third.png" width="35" alt="Accor Plus Logo"/>
            default:
                return <p>{index}</p>
        }
    }

    getMembershipBreakdown = (data) =>{
        let unique = [];
        data.forEach(element =>{
            unique = Object.keys(element.membershipBreakdown)
        });
        return unique;
    }
    
    render() {
        const {filteredData, employeeData, countryData, countryFilteredData, globalData, globalFilteredData, dashboardData, fetchingData} = this.state;
        const {selected,showLeaderBoard, startDate, endDate, hotelDetails, filterCountry, employeePage, countryPage, globalPage} = this.state;
        const {fetchingEmployeeData, employeeEndOfList, fetchingCountryData, countryEndOfList, fetchingGlobalData, globalEndOfList} = this.state;
        const {hotelCode, hotelName} = this.props.location.state;
        
        const employeeDataMap = (filteredData.length > 0) ? filteredData : employeeData;
        const countryDataMap = (countryFilteredData.length > 0) ? countryFilteredData :countryData;
        const globalDataMap = (globalFilteredData.length > 0) ? globalFilteredData :globalData;

        const filterByCountry = filterCountry.map((item) =>
            <option value={item}>{item}</option>
        );
        const colors = ['#E38627', '#C13C37', '#6A2135'];

        const pieChartData = [];
        let pieChartDataSum = 0;
        if(dashboardData.membershipBreakdown && Object.keys(dashboardData.membershipBreakdown).length > 0){
            Object.keys(dashboardData.membershipBreakdown).map(function(key, index) {
                const value = parseInt(dashboardData.membershipBreakdown[key], 10);
                pieChartDataSum = pieChartDataSum + value;
                pieChartData.push({title: key, value: value, color: colors[index] });
            });
        }

        return (
            <div className="hotelSales-wrapper">
                <Header 
                    showLeaderBoard   = {showLeaderBoard}
                    hasGlobalMessage
                    hideBanner
                    goBack = {()=> this.props.history.push("/")}
                    />
                
                <div className="container leaderboard">
                    {/* <button className="btn btn-secondary mt-4" onClick={()=> this.props.history.goBack()}>
                        <FontAwesomeIcon icon={faChevronLeft} /> Back
                    </button> */}
                    <div className="row mt-4">
                        <div className="col-12 col-md-8">
                            <div class="info-box">
                                <span class="info-box-icon bg-danger"><FontAwesomeIcon icon={faHotel} /></span>
                                <div class="info-box-content">
                                    <span class="info-box-text"><h4>{hotelName}</h4></span>
                                    <span class="info-box-number"> RID {hotelCode}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div class="info-box">
                                <span class="info-box-icon bg-danger"><FontAwesomeIcon icon={faIdCardAlt} /></span>
                                <div class="info-box-content">
                                    <span class="info-box-text"><h4>Total Memberships</h4></span>
                                    <span class="info-box-number">{hotelDetails.unitsSold ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card card-info card-outline">
                        <div className="card-body">
                            <div className="row align-items-end">
                                <div className="col-12 col-md-4 mb-2 mb-md-0">
                                    <label>Start Date</label>
                                <DatePicker
                                            className="form-control"
                                            selected={startDate}
                                            dateFormat="dd - MM - yyyy"
                                            onChange={(date) => this.handleStartDate(date)}/>
                                </div>
                                <div className="col-12 col-md-4 mb-2 mb-md-0">
                                <label>End Date</label>
                                <DatePicker
                                            className="form-control"
                                            selected={endDate} 
                                            onChange={(date) => this.handleEndDate(date)}
                                            dateFormat="dd - MM - yyyy"/>
                                </div>
                                <div className="col-12 col-md-4 mb-2 mb-md-0">
                                <button className="btn btn-primary btn-block" onClick={this.handleClick}>
                                        <FontAwesomeIcon icon={faSearch} /> SEARCH
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 mb-5">
                        <Tabs defaultActiveKey="dashboard" id="uncontrolled-tab-example">
                            <Tab eventKey="dashboard" title="DASHBOARD">
                                {fetchingData && (
                                    <LoadingScreen/>
                                )}
                                {!fetchingData && (
                                    <div className = "row mt-4">
                                    {dashboardData && !_.isEmpty(dashboardData) &&(
                                        <React.Fragment>
                                            <div className="col-md-8">
                                            </div>
                                            <div className="col-12 col-md-4 mb-3">
                                                <select className="form-control" onChange={this.handleTypeChange}>
                                                    <option value = "monthly">Monthly</option>
                                                    <option value ="weekly" >Weekly</option>
                                                </select>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div class="card">
                                                    <div class="card-header">
                                                        <h3 class="card-title font-weight-bold">Membership Breakdown</h3>
                                                    </div>
                                                    <div class="card-body">
                                                        <PieChart
                                                            animation
                                                            animationDuration={500}
                                                            animationEasing="ease-out"
                                                            center={[50, 50]}
                                                            data={pieChartData}
                                                            radius={PieChart.defaultProps.radius - 6}
                                                            lineWidth={60}
                                                            viewBoxSize={[100, 100]}
                                                            segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                                                            segmentsShift={(index) => (index === selected ? 6 : 1)}
                                                            animate
                                                            label={({ dataEntry }) => dataEntry.value}
                                                            labelPosition={100 - 60 / 2}
                                                            labelStyle={{
                                                                fill: '#fff',
                                                                opacity: 0.75,
                                                                pointerEvents: 'none',
                                                                fontSize:'0.75rem',
                                                                fontWeight:'700'
                                                            }}
                                                            totalValue={pieChartDataSum}
                                                            onClick={(_, index) => {
                                                                this.setState({selected : index === selected ? undefined : index});
                                                            }}/>
                                                    </div>
                                                    <div className="card-footer">
                                                        <ul class="chart-legend clearfix">
                                                            {pieChartData.length > 0 && pieChartData.map((item, index) =>
                                                                <li> <FontAwesomeIcon icon={faSquare} color={item.color} /> {item.title} - {item.value}  </li>
                                                            )}
                                                        </ul>   
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-8">
                                            <div class="card">
                                                    <div class="card-header">
                                                        <h3 class="card-title font-weight-bold"><FontAwesomeIcon icon={faListOl}/> Top 5 Hotels in your Country</h3>
                                                    </div>
                                                    <div class="card-body p-0">
                                                        <Accordion>
                                                            <div className="row mt-4 mb-2 mx-0 leaderboardTable-head">
                                                                <div className="col-2 text-center">Ranking</div>
                                                                <div className="mb-0 col-6">
                                                                    Sales Representative Id
                                                                </div>
                                                                <div className="mb-0 col-3 text-center">
                                                                    Total
                                                                </div>
                                                                <div className="mb-0 col-1">
                                                                </div>  
                                                            </div>
                                                            {dashboardData.topHotels && dashboardData.topHotels.map((item, index) =>
                                                                <Card key={index} className="leaderboardTable-body">
                                                                    <Accordion.Toggle as={Card.Header} eventKey={index+1}>
                                                                        <div className="d-flex font-weight-bold">
                                                                            <div className="mb-0 col-2 text-center">
                                                                                {this.getRanking(index+1)}
                                                                            </div>
                                                                            <div className="mb-0 col-6">
                                                                                <p className="mb-1 font-weight-bold">{item.vendorName}</p> 
                                                                                <p className="mb-0">RID {item.rid_code}</p>
                                                                            </div>
                                                                            <div className="mb-0 col-3 text-center">
                                                                                {item.unitsSold}
                                                                            </div>
                                                                            <div className="mb-0 col-1">
                                                                                <button className="btn btn-primary"><FontAwesomeIcon icon={faPlus}/></button>
                                                                            </div>   
                                                                        </div>
                                                                    </Accordion.Toggle>
                                                                    <Accordion.Collapse eventKey={index+1}>
                                                                        <Card.Body>
                                                                            <div className="row">
                                                                                <div className="col-2"></div>
                                                                                <div className="col-10">
                                                                                {this.getMembershipBreakdown(dashboardData.topHotels).map((element) => 
                                                                                    <p>{element} : {item.membershipBreakdown[element]}</p>
                                                                                )}
                                                                                </div>
                                                                            </div>
                                                                        </Card.Body>
                                                                    </Accordion.Collapse>
                                                                </Card>
                                                            )}
                                                            {dashboardData.topHotels && dashboardData.topHotels.length == 0  && (
                                                                <div className="font-weight-bold text-center mt-4">
                                                                    <p><FontAwesomeIcon icon={faExclamation}/> No Data Found! Contact your AccorPlus Ambassador</p>
                                                            </div> 
                                                            )}
                                                        </Accordion>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                    {dashboardData.length === 0 && (
                                        <div className="col-12 font-weight-bold text-center">
                                            <p><FontAwesomeIcon icon={faExclamation}/> No Data Found! Contact your AccorPlus Ambassador</p>
                                        </div> 
                                    )}
                                </div>
                                )}
                            </Tab>
                            <Tab eventKey="hotel" title="HOTEL">
                                {fetchingData && (
                                    <LoadingScreen/>
                                )}
                                {!fetchingData && employeeDataMap.length>0 && (
                                    <React.Fragment>
                                        <div className = "row mt-4">
                                            <div className="col-md-8"></div>
                                            <div className="col-12 col-md-4 input-group">
                                                <input type="text" placeholder="Search" className="form-control" onChange={this.handleChange}></input>
                                                <div className="input-group-append">
                                                    <div className="input-group-text">
                                                            <FontAwesomeIcon icon={faSearch} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Accordion>
                                            <div className="row mt-4 mb-2 leaderboardTable-head">
                                                <div className="col-2 text-center">Ranking</div>
                                                <div className="mb-0 col-6">
                                                    Sales Representative Id
                                                </div>
                                                <div className="mb-0 col-3 text-center">
                                                    Total
                                                </div>
                                                <div className="mb-0 col-1">
                                                </div>  
                                            </div>
                                            {employeeDataMap.map((item, index) =>
                                                <Card key={index} className="leaderboardTable-body">
                                                    <Accordion.Toggle as={Card.Header} eventKey={index+1}>
                                                        <div className="d-flex font-weight-bold">
                                                            <div className="mb-0 col-2 text-center">
                                                                {this.getRanking(item.index)}
                                                            </div>
                                                            <div className="mb-0 col-6">
                                                                {item.salesRepId}
                                                            </div>
                                                            <div className="mb-0 col-3 text-center">
                                                                {item.unitsSold}
                                                            </div>
                                                            <div className="mb-0 col-1">
                                                                <button className="btn btn-primary"><FontAwesomeIcon icon={faPlus}/></button>
                                                            </div>   
                                                        </div>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey={index+1}>
                                                        <Card.Body>
                                                            <div className="row">
                                                                <div className="col-2"></div>
                                                                <div className="col-10">
                                                                {this.getMembershipBreakdown(employeeDataMap).map((element) => 
                                                                    <p className="mb-0">{element} : {item.membershipBreakdown[element]}</p>
                                                                )}
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            )}
                                        </Accordion>
                                        <div className="font-weight-bold text-center mt-4">
                                            {fetchingEmployeeData && <p>Loading ...</p>}
                                            {employeeEndOfList && <p><FontAwesomeIcon icon={faExclamation} color="#ec6527"/> End of List</p>}
                                            {!employeeEndOfList && !fetchingEmployeeData && <button className="btn btn-secondary" onClick={ ()=>this.getEmployeeData(startDate, endDate, hotelCode, true)}> Load More <FontAwesomeIcon icon={faChevronRight}/></button>}
                                        </div> 
                                    </React.Fragment>
                                )}
                                {employeeDataMap.length == 0 && !employeeEndOfList && (
                                    <div className="font-weight-bold text-center mt-4">
                                        <p><FontAwesomeIcon icon={faExclamation}/> No Data Found! Contact your AccorPlus Ambassador</p>
                                    </div> 
                                )}
                            </Tab>
                            <Tab eventKey="country" title="COUNTRY" >
                                {fetchingData && (
                                    <LoadingScreen/>
                                )}
                                {!fetchingData &&countryDataMap.length > 0 && (
                                    <React.Fragment>
                                        <div className ="row mt-4">
                                        <div className="col-8">

                                        </div>
                                        <div className="col-12 col-md-4 input-group">
                                            <input type="text" placeholder="Search" className="form-control" onChange={this.handleCountrySearch}></input>
                                            <div className="input-group-append">
                                                <div className="input-group-text">
                                                        <FontAwesomeIcon icon={faSearch} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        <Accordion>
                                            <div className="row mt-4 mb-2 leaderboardTable-head">
                                                <div className="col-1 text-center">Ranking</div>
                                                <div className="mb-0 col-7">
                                                    Hotel
                                                </div>
                                                <div className="mb-0 col-3 text-center">
                                                    Total
                                                </div>
                                                <div className="mb-0 col-1">
                                                </div>  
                                            </div>
                                            {countryDataMap.map((item, index) =>
                                                <Card key={index} className={hotelCode === item.rid_code ? 'leaderboardTable-body active' : 'leaderboardTable-body'}>
                                                    <Accordion.Toggle as={Card.Header} eventKey={index+1}>
                                                        <div className="d-flex">
                                                            <div className="mb-0 col-1 text-center font-weight-bold">
                                                                {this.getRanking(item.index)}
                                                            </div>
                                                            <div className="mb-0 col-7">
                                                                <p className="mb-1 font-weight-bold">{item.vendorName}</p> 
                                                                <p className="mb-0">RID {item.rid_code}</p>
                                                            </div>
                                                            <div className="mb-0 col-3 text-center font-weight-bold">
                                                                {item.unitsSold}
                                                            </div>
                                                            <div className="mb-0 col-1">
                                                                <button className="btn btn-primary"><FontAwesomeIcon icon={faPlus}/></button>
                                                            </div>   
                                                        </div>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey={index+1}>
                                                        <Card.Body>
                                                            <div className="row">
                                                                <div className="col-1"></div>
                                                                <div className="col-11">
                                                                    {this.getMembershipBreakdown(countryDataMap).map((element) => 
                                                                        <p className="mb-0">{element} : {item.membershipBreakdown[element]}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card> 
                                            )}
                                        </Accordion>
                                        <div className="font-weight-bold text-center mt-4">
                                            {fetchingCountryData && <p>Loading ...</p>}
                                            {countryEndOfList && <p><FontAwesomeIcon icon={faExclamation} color="#ec6527"/> End of List</p>}
                                            {!countryEndOfList && !fetchingCountryData && <button className="btn btn-secondary" onClick={ ()=> this.getCountryData(startDate, endDate, true)}> Load More <FontAwesomeIcon icon={faChevronRight}/></button>}
                                        </div> 
                                    </React.Fragment>
                                )}
                                {countryDataMap.length == 0 && !countryEndOfList && (
                                    <div className="font-weight-bold text-center mt-4">
                                        <p><FontAwesomeIcon icon={faExclamation}/> No Data Found! Contact your AccorPlus Ambassador</p>
                                    </div>
                                )}
                            </Tab>
                            <Tab eventKey="global" title="GLOBAL">
                            {fetchingData && (
                                    <LoadingScreen/>
                                )}
                                {!fetchingData && globalDataMap.length > 0 && (
                                    <React.Fragment>
                                        <div className ="row mt-4">
                                            <div className="col-12 col-md-4">
                                                <select className="form-control mb-4 mb-md-0" onChange={this.handleFilterCountrySearch}>
                                                <option value="all" selected>All</option>
                                                    {filterByCountry}
                                                </select>
                                            </div>
                                            <div className="col-md-4">

                                            </div>
                                            <div className="col-12 col-md-4 input-group">
                                                <input type="text" placeholder="Search" className="form-control" onChange={this.handleGlobalSearch}></input>
                                                <div className="input-group-append">
                                                    <div className="input-group-text">
                                                            <FontAwesomeIcon icon={faSearch} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Accordion>
                                            <div className="row mt-4 mb-2 leaderboardTable-head">
                                                <div className="col-1 text-center">Ranking</div>
                                                <div className="mb-0 col-6">
                                                    Hotel
                                                </div>
                                                <div className="mb-0 col-2">
                                                    Country
                                                </div>
                                                <div className="mb-0 col-2 text-center">
                                                    Total
                                                </div>
                                                <div className="mb-0 col-1">
                                                </div>  
                                            </div>
                                            {globalDataMap.map((item, index) =>
                                                <Card key={index} className={hotelCode === item.rid_code ? 'leaderboardTable-body active' : 'leaderboardTable-body'}>
                                                    <Accordion.Toggle as={Card.Header} eventKey={index+1}>
                                                        <div className="d-flex">
                                                            <div className="mb-0 col-1 text-center font-weight-bold">
                                                                {this.getRanking(item.index)}
                                                            </div>
                                                            <div className="mb-0 col-6">
                                                                <p className="mb-1 font-weight-bold">{item.vendorName}</p> 
                                                                <p className="mb-0">RID {item.rid_code}</p>
                                                            </div>
                                                            <div className="mb-0 col-2 font-weight-bold">
                                                                {item.countryName}
                                                            </div>
                                                            <div className="mb-0 col-2 text-center font-weight-bold">
                                                                {item.unitsSold}
                                                            </div>
                                                            <div className="mb-0 col-1 font-weight-bold">
                                                                <button className="btn btn-primary"><FontAwesomeIcon icon={faPlus}/></button>
                                                            </div>   
                                                        </div>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey={index+1}>
                                                        <Card.Body>
                                                            <div className="row">
                                                                <div className="col-1"></div>
                                                                <div className="col-11">
                                                                    {this.getMembershipBreakdown(globalDataMap).map((element) => 
                                                                        <p>{element} : {item.membershipBreakdown[element]}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card> 
                                            )}
                                        </Accordion>
                                        <div className="font-weight-bold text-center mt-4">
                                            {fetchingGlobalData && <p>Loading ...</p>}
                                            {globalEndOfList && <p><FontAwesomeIcon icon={faExclamation} color="#ec6527"/> End of List <FontAwesomeIcon icon={faExclamation} color="#ec6527"/></p>}
                                            {!globalEndOfList && !fetchingGlobalData && <button className="btn btn-secondary" onClick={ ()=> this.getGlobalData(startDate, endDate, true)}> Load More <FontAwesomeIcon icon={faChevronRight}/></button>}
                                        </div> 

                                    </React.Fragment>
                                )}
                                {globalDataMap.length == 0 && !globalEndOfList && (
                                        <div className="col-12 font-weight-bold text-center mt-2">
                                            <p><FontAwesomeIcon icon={faExclamation}/> No Data Found! Contact your AccorPlus Ambassador</p>
                                        </div>
                                )}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
        </div>
        );
    }
}

export default (LeaderBoard);
