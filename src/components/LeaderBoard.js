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
        this.setState({
            fetchingData : true,
            employeePage : 1,
            countryPage  : 1,
            globalPage   : 1
        });
        const fetchEmployee = this.getEmployeeData(startDate, endDate, hotelCode);
        const fetchCountry = this.getCountryData(startDate, endDate);
        const fetchGlobal = this.getGlobalData(startDate, endDate);
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
        {data.membershipBreakdown && Object.entries(data.membershipBreakdown).forEach(([key, value]) => {
           unique.push(key);
        })}
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

        let pieChartData = [{title: 'No Data', value: 0, color: colors[1] }];
        let pieChart = false;
        let pieChartDataSum = 0;
        if(dashboardData.membershipBreakdown && Object.keys(dashboardData.membershipBreakdown).length > 0){
            pieChartData = [];
            pieChart = true;
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
                                <span class="info-box-icon">
                                <svg viewBox="0 0 18 18" class="icon" width="50" height="50"><path d="M6.6 6.2h-.7c-.1 0-.2.1-.2.2v1c0 .1.1.2.2.2h.8c.1 0 .2-.1.2-.2v-1c-.1-.1-.2-.2-.3-.2zm0 3h-.7c-.1 0-.2.1-.2.2v1c0 .1.1.2.2.2h.8c.1 0 .2-.1.2-.2v-1c-.1-.1-.2-.2-.3-.2zm4.8-1.6h.8c.1 0 .2-.1.2-.2v-1c0-.1-.1-.2-.2-.2h-.8c-.1 0-.2.1-.2.2v1c0 .1.1.2.2.2zm.9 2.8v-1c0-.1-.1-.2-.2-.2h-.8c-.1 0-.2.1-.2.2v1c0 .1.1.2.2.2h.8c.2 0 .2-.1.2-.2zM9.4 6.2h-.8c-.1 0-.2.1-.2.2v1c0 .1.1.2.2.2h.8c.1 0 .2-.1.2-.2v-1c0-.1-.1-.2-.2-.2zm0 3h-.8c-.1 0-.2.1-.2.2v1c0 .1.1.2.2.2h.8c.1 0 .2-.1.2-.2v-1c0-.1-.1-.2-.2-.2zM3 15.9l-.5.6h4v-1.2H4.4c-.5 0-1 .3-1.4.6zm3.9-3v3.7h1.9v-3.9H7.1c-.1 0-.2.1-.2.2zM4.2 4.3h9.7c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H4.2c-.3 0-.5.2-.5.5s.2.5.5.5zM4.6 3h8.8v-.8h.5v-.8H4.1v.8h.5V3zm6.9 11.9h2.4V4.7H4.2v10.2h2.4v-2.1c0-.3.3-.6.6-.6h3.7c.3 0 .6.3.6.6v2.1zm-.7-8.5c0-.3.3-.6.6-.6h.8c.3 0 .6.3.6.6v1c0 .3-.3.6-.6.6h-.8c-.3 0-.6-.3-.6-.6v-1zm-3.6 4c0 .3-.2.6-.6.6h-.7c-.3 0-.6-.3-.6-.6v-1c0-.3.3-.6.6-.6h.8c.3 0 .6.3.6.6v1zm0-3c0 .3-.2.6-.6.6h-.7c-.4 0-.6-.3-.6-.6v-1c0-.3.3-.6.6-.6h.8c.3 0 .6.3.6.6v1zm2.8 3c0 .3-.3.6-.6.6h-.8c-.3 0-.6-.3-.6-.6v-1c0-.3.3-.6.6-.6h.8c.3 0 .6.3.6.6v1zm0-3c0 .3-.3.6-.6.6h-.8c-.3 0-.6-.3-.6-.6v-1c0-.3.3-.6.6-.6h.8c.3 0 .6.3.6.6v1zm1.4 3.6c-.3 0-.6-.3-.6-.6v-1c0-.3.3-.6.6-.6h.8c.3 0 .6.3.6.6v1c0 .3-.3.6-.6.6h-.8zm3.6 4.9c-.3-.4-.8-.6-1.4-.6h-2.1v1.2h4l-.5-.6zm-4.1-3.2H9.2v3.9h1.9v-3.7c0-.1-.1-.2-.2-.2z"></path></svg>
                                </span>
                                <div class="info-box-content">
                                    <span class="info-box-text"><h4>{hotelName}</h4></span>
                                    <span class="info-box-number"> RID {hotelCode}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div class="info-box">
                                <span class="info-box-icon">
                                    <svg width="50" height="50" viewBox="-7 -7 102 73">
                                        <path class="icon" d="M0 7.92A7.92 7.92 0 017.92 0h72.16A7.92 7.92 0 0188 7.92v43.59a7.92 7.92 0 01-7.92 7.92H7.92A7.92 7.92 0 010 51.51V7.92z"></path><path d="M40.4 38.98h2.33l.01-.05c-1.43-.31-1.56-1.09-1.56-2.19V22.9h-3v13.38a3.39 3.39 0 00.38 2 2 2 0 001.84.7zm17.81-11.3a1.1 1.1 0 00-.4-.4 1.23 1.23 0 00-1.4.18 1.11 1.11 0 00-.34.81 1.091 1.091 0 00.34.81 1.15 1.15 0 00.83.33 1.2 1.2 0 00.57-.14 1 1 0 00.4-.4l-.34-.24a.71.71 0 01-1.283-.076.7.7 0 01-.047-.274.66.66 0 01.2-.52.66.66 0 01.5-.21.71.71 0 01.63.37l.34-.24zm-3.39-.4a1.1 1.1 0 01.4.4l-.34.24a.74.74 0 00-.907-.32.699.699 0 00-.433.68.69.69 0 00.2.51.68.68 0 00.51.21.74.74 0 00.63-.37l.34.24a1.1 1.1 0 01-.4.4 1.2 1.2 0 01-.57.14 1.13 1.13 0 01-.83-.33 1.06 1.06 0 01-.34-.81 1.07 1.07 0 01.34-.81 1.18 1.18 0 01.83-.32c.199-.001.395.047.57.14zm-3.04 1.82h-.9l-.12.29h-.49l1-2.19h.18l1 2.19h-.55l-.12-.29zm-.45-1.1l-.29.74h.58l-.29-.74zm9.73-.52a1.071 1.071 0 01.34.81 1.061 1.061 0 01-.34.81 1.16 1.16 0 01-.83.33 1.118 1.118 0 01-.82-.33 1.06 1.06 0 01-.34-.81 1.07 1.07 0 01.34-.81c.22-.21.515-.325.82-.32a1.2 1.2 0 01.83.32zm-1.33.3a.69.69 0 00-.2.51.7.7 0 00.2.52.66.66 0 00.5.21.678.678 0 00.51-.21.72.72 0 00.2-.52.69.69 0 00-.2-.51.68.68 0 00-.51-.21.66.66 0 00-.5.21zm3.5.84l.57.77h.5l-.62-.86a.65.65 0 00.39-.62.68.68 0 00-.22-.52.84.84 0 00-.57-.19h-.83v2.19h.45v-.77h.33zm.05-.4h-.38v-.63h.38a.319.319 0 01.31.195.3.3 0 01.02.125.279.279 0 01-.09.22.32.32 0 01-.24.09zm-12.56 5.56h1v.41h-1.4v-2.2h.44l-.04 1.79zm1.9.41h.44v-2.2h-.44v2.2zm3.46-2.2l-1 2.2h-.18l-1-2.2h.51l.59 1.29.55-1.33.53.04zm1.39.41h1v-.36H57v2.2h1.53v-.41h-1.06v-.55h.75v-.44h-.75v-.44zm-6.75 6.18h1v.4h-1.4v-2.19h.44l-.04 1.79zm1.9.4h.44v-2.19h-.44v2.19zm3.74-2.19v2.19h-.45v-1.17l-.55.69h-.15l-.55-.69v1.17h-.45v-2.19h.18l.89 1.15.9-1.15h.18zm1.19 2.19H58v-2.19h-.45v2.19zm3.18-1.79H60v1.79h-.45v-1.79h-.7v-.4h1.86l.02.4zm2.36 1.39h-1v-1.79h-.45v2.19h1.45v-.4zm2.37-1.39h-1v.45h.76v.38h-.76v.56h1.04v.4H64v-2.19h1.48l-.02.4zm2.44-.03a.83.83 0 00-.29-.3.86.86 0 00-.41-.11.84.84 0 00-.53.17.56.56 0 00-.2.45.498.498 0 00.14.37c.114.108.246.196.39.26l.25.11.15.07.09.08a.27.27 0 010 .12.22.22 0 01-.08.18.37.37 0 01-.23.06.66.66 0 01-.54-.32l-.31.24c.087.143.207.263.35.35a1 1 0 00.5.13.81.81 0 00.55-.18.581.581 0 00.22-.48.52.52 0 00-.13-.37 1.209 1.209 0 00-.41-.27l-.25-.11-.2-.11a.179.179 0 01-.06-.14.19.19 0 01.08-.16.39.39 0 01.2-.05.48.48 0 01.41.25l.31-.24zm2.16-.3a.92.92 0 01.29.3l-.31.24a.48.48 0 00-.42-.25.38.38 0 00-.19.05.191.191 0 00-.08.16.18.18 0 00.06.14.84.84 0 00.2.11l.25.11c.154.061.293.153.41.27a.57.57 0 01.13.37.58.58 0 01-.22.48.83.83 0 01-.55.18.93.93 0 01-.5-.13 1.059 1.059 0 01-.35-.35l.31-.24a.65.65 0 00.54.32.39.39 0 00.23-.06.22.22 0 00.08-.18.19.19 0 000-.12l-.08-.08-.16-.07-.23-.11a1.631 1.631 0 01-.4-.26.54.54 0 01-.13-.37.559.559 0 01.2-.45.81.81 0 01.52-.17.87.87 0 01.4.11zm-33.39 2.12h-3.75l-2.75-5.7c-.848.464-1.491 1.27-2.167 2.115-.52.65-1.058 1.324-1.723 1.885a8.798 8.798 0 01-2.82 1.59c-.558.188-1.13.332-1.71.43h-.25c-.02 0 0-.07.17-.14a9.68 9.68 0 001.33-.79 1.76 1.76 0 00.82-1.09 3.69 3.69 0 01-.12-3.8c.214-.423.41-.78.59-1.107.148-.267.284-.515.41-.763.283-.7.464-1.438.54-2.19.52.53 2.56 2.63 2.26 4.71a13 13 0 002.4-1.47c.125-.099.24-.198.35-.293.393-.337.722-.62 1.19-.627.35-.006.493.08.633.165.099.06.197.12.367.145a.78.78 0 00.35 0v-.07c-.248-.055-.417-.172-.586-.288-.232-.161-.464-.322-.904-.322-.569 0-.975.347-1.307.631a3.527 3.527 0 01-.313.249l-1.93-4c-.8-1.68-.56-2.89 1.21-5.29l7.71 16.02zm9.76 0h2.33l.01-.05c-1.43-.31-1.56-1.09-1.56-2.19V22.9h-3v13.38a3.39 3.39 0 00.38 2 2 2 0 001.84.7z"></path>
                                    </svg>
                                </span>
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
                                                        {pieChart && (
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
                                                        )}
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
                                                                                {this.getMembershipBreakdown(item).map((element) => 
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
                                                                {this.getMembershipBreakdown(item).map((element) => 
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
                                                                    {this.getMembershipBreakdown(item).map((element) => 
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
                                                                    {this.getMembershipBreakdown(item).map((element) => 
                                                                        <p>{element} : {item.membershipBreakdown[element]}</p>
                                                                    )}
                                                                    {/* {item.membershipBreakdown && Object.entries(item.membershipBreakdown).forEach(([key, value]) => {
                                                                        <p>{key} : {value}</p>
                                                                    })} */}
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
