import React, {Component} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart } from 'react-minimal-pie-chart';

import axios from 'axios';

import Header from './Header';
import ErrorMessage from './common/errorMessage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch, faHotel, faIdCardAlt, faStar,faSquare } from '@fortawesome/free-solid-svg-icons'
import { Tabs, Tab } from "react-bootstrap";
import _ from 'lodash';

import { VENDORAPI, MAP_COUNTRYCODES, GLOBALAPIHEADER } from './../constants/index';

import '../css/style.css';
import '../css/leaderboard.css';

class LeaderBoard extends Component {
    constructor(props) {
        super(props);
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.state = {
            showLeaderBoard     : false,
            startDate           : firstDay,
            endDate             : new Date(),
            searchInput         : "",
            data                : [],
            filteredData        : [],
            employeeData        :[],
            country             : [],
            countryData         : [],
            countryFilteredData : [],
            global              : [],
            globalData          : [],
            globalFilteredData  : [],
            filterCountry       : [],
            countrySearch       : '',
            showGlobalError     : false,
            selected            :''
        };

    }

    componentDidMount() {
        const employeeData = {
            "rid_code": "B3U6",
            "total_units_sold": 100,
            "start_date": "01/01/2021",
            "end_date": "01/01/2022",
            "employees": [
                {
                    "EM-00121": {
                        "unitsSold": 5,
                        "membershipBreakdown": {
                            "discovery": "3",
                            "explorer": "2"
                        }
                    }
                },
                {
                    "EM-00451": {
                        "unitsSold": 10,
                        "membershipBreakdown": {
                            "discovery": "5",
                            "explorer": "5"
                        }
                    }
                },
                {
                    "EM-00569": {
                        "unitsSold": 30,
                        "membershipBreakdown": {
                            "discovery": "10",
                            "explorer": "20"
                        }
                    }
                },
                {
                    "EM-00478": {
                        "unitsSold": 50,
                        "membershipBreakdown": {
                            "discovery": "20",
                            "explorer": "30"
                        }
                    }
                },
                {
                    "EM-00238": {
                        "unitsSold": 13,
                        "membershipBreakdown": {
                            "discovery": "10",
                            "explorer": "3"
                        }
                    }
                },
                {
                    "EM-00579": {
                        "unitsSold": 2,
                        "membershipBreakdown": {
                            "discovery": "1",
                            "explorer": "1"
                        }
                    }
                }
            ]
        };

        const country = [
            { 
                "1181": {
                    "start_date": "01/01/2021",
                    "end_date": "01/01/2022",
                    "vendorName": "NOVOTEL SYDNEY DARLING HARBOUR",
                    "country": "Australia",
                    "subsidiary": 16,
                    "location": 56,
                    "department": 55,
                    "imageURL": "", 
                    "unitsSold": 60,
                    "membershipBreakdown": {
                        "discovery": "20",
                        "explorer": "30",
                        "traveller":"10"
                    }
                }
            },
            { 
                "1757": {
                    "start_date": "01/01/2021",
                    "end_date": "01/01/2022",
                    "vendorName": "IBIS SYDNEY DARLING HARBOUR",
                    "country": "Australia",
                    "subsidiary": 16,
                    "location": 56,
                    "department": 55,
                    "imageURL": "", 
                    "unitsSold": 50,
                    "membershipBreakdown": {
                        "discovery": "20",
                        "explorer": "22",
                        "traveller":"8"
                    }
                }
            },
            { 
                "2073": {
                    "start_date": "01/01/2021",
                    "end_date": "01/01/2022",
                    "vendorName": "MERCURE SYDNEY",
                    "country": "Australia",
                    "subsidiary": 16,
                    "location": 56,
                    "department": 55,
                    "imageURL": "", 
                    "unitsSold": 10,
                    "membershipBreakdown": {
                        "discovery": "10",
                        "explorer": "0",
                        "traveller":"0"
                    }
                }
            },
            { 
                "2132": {
                    "start_date": "01/01/2021",
                    "end_date": "01/01/2022",
                    "vendorName": "IBIS SYDNEY WORLD SQUARE",
                    "country": "Australia",
                    "subsidiary": 16,
                    "location": 56,
                    "department": 55,
                    "imageURL": "", 
                    "unitsSold": 100,
                    "membershipBreakdown": {
                        "discovery": "59",
                        "explorer": "31",
                        "traveller":"10"
                    }
                }
            },
            { 
                "2732": {
                    "start_date": "01/01/2021",
                    "end_date": "01/01/2022",
                    "vendorName": "NOVOTEL SYDNEY OLYMPIC PARK",
                    "country": "Australia",
                    "subsidiary": 16,
                    "location": 56,
                    "department": 55,
                    "imageURL": "", 
                    "unitsSold": 100,
                    "membershipBreakdown": {
                        "discovery": "59",
                        "explorer": "31",
                        "traveller":"10"
                    }
                }
            },
            { 
                "2734": {
                    "start_date": "01/01/2021",
                    "end_date": "01/01/2022",
                    "vendorName": "IBIS SYDNEY OLYMPIC PARK",
                    "country": "Australia",
                    "subsidiary": 16,
                    "location": 56,
                    "department": 55,
                    "imageURL": "", 
                    "unitsSold": 100,
                    "membershipBreakdown": {
                        "discovery": "59",
                        "explorer": "31",
                        "traveller":"10"
                    }
                }
            },
            { 
                "8763": {
                    "start_date": "01/01/2021",
                    "end_date": "01/01/2022",
                    "vendorName": "PULLMAN SYDNEY HYDE PARK",
                    "country": "Australia",
                    "subsidiary": 16,
                    "location": 56,
                    "department": 55,
                    "imageURL": "", 
                    "unitsSold": 100,
                    "membershipBreakdown": {
                        "discovery": "59",
                        "explorer": "31",
                        "traveller":"10"
                    }
                }
            },
            { 
                "6582": {
                    "start_date": "01/01/2021",
                    "end_date": "01/01/2022",
                    "vendorName": "IBIS BUDGET SYDNEY OLYMPIC PARK",
                    "country": "Australia",
                    "subsidiary": 16,
                    "location": 56,
                    "department": 55,
                    "imageURL": "", 
                    "unitsSold": 9,
                    "membershipBreakdown": {
                        "discovery": "2",
                        "explorer": "4",
                        "traveller":"3"
                    }
                }
            }
            
        ];

        //get Global Hotal Data
        this.getGlobalData();

        this.setState({
            employeeData : employeeData,
            country : country});

        var filterData = [];
        employeeData.employees.map((item, index) => {
            const employeeID = Object.keys(item)[0];
            const data = Object.values(item)[0];
            filterData[index] = data;
            filterData[index].employeeID =  employeeID;
            var percentage = (data.unitsSold/employeeData.total_units_sold)*100;
            percentage = Math.round(percentage * 100)/100;
            var progressBar = "";
            if(percentage <= 20){
                progressBar = "bg-danger";
            }else if (percentage > 20 && percentage <= 40){
                progressBar = "bg-warning";
            } else if (percentage > 40 && percentage <= 60){
                progressBar = "bg-primary";
            } else if (percentage > 60){
                progressBar = "bg-success";
            }
            filterData[index].percentage =  percentage;
            filterData[index].progressBar =  progressBar;
        }
        ); 

        var countryData = [];
        country.map((item, index) => {
            const RID = Object.keys(item)[0];
            const data = Object.values(item)[0];
            countryData[index] = data;
            countryData[index].RID =  RID;
        }
        ); 

        let sortedData = _.orderBy(filterData, ['unitsSold'],['desc']);
        let countrySortedData = _.orderBy(countryData, ['unitsSold'],['desc']);
       
        this.setState({
            data    : sortedData,
        countryData : countrySortedData});
    }

    getGlobalData = () => {
        axios.get(`${VENDORAPI}`, GLOBALAPIHEADER)
            .then(response => {
                if (response.status === 200) {
                    this.setState({global : response.data});
                    let globalData = [];
                    Object.entries(response.data).map((key, index) => {
                        const RID = key[0];
                        const data = key[1];
                        globalData[index] = data;
                        globalData[index].RID =  RID;   
                        globalData[index].countryName = MAP_COUNTRYCODES[data.country]; 
                    });

                    const uniques = _.uniq(_.map(globalData, 'country'));
                    let filterCounrty = [];
                    uniques.map((item)=>{
                        filterCounrty.push(MAP_COUNTRYCODES[item])
                    })

                    var test =  _.mapValues(_.groupBy(globalData, "unitsSold"), v => _.sortBy(v, "vendorName"));
                    var global=[];
                    Object.entries(test).reverse().map((key, index) => {
                        if(key[1].length > 0){
                            key[1].map((item) => {
                                global.push(item);
                            })
                        }
                    });

                    console.log(global);
                    this.setState({
                        globalData  : global,
                        filterCountry: filterCounrty });
                } else throw new Error('Oops, something went wrong');
            }).catch(error => {
                console.log('error', error) 
                this.setState({ showGlobalError : true });  
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
                value.employeeID.toLowerCase().includes(searchInput.toLowerCase()) ||
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
                searchInput.match(value.RID) || searchInput.match(value.unitsSold) ||
                searchInput.match(value.membershipBreakdown.discovery) || 
                searchInput.match(value.membershipBreakdown.explorer) ||
                searchInput.match(value.membershipBreakdown.traveller)
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
                searchInput.match(value.RID));
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

    handleClick = () => {
        console.log("Clicked Search");
    }

    render() {
        const {selected,showLeaderBoard, startDate, endDate, data, searchInput, filteredData, employeeData, countryData, countryFilteredData, globalData, globalFilteredData, filterCountry} = this.state;
        const {hotelCode, hotelName} = this.props.location.state;
        
        let dataMap = data;
        if(filteredData.length > 0){
            dataMap = filteredData;
        }

        let countryDataMap = countryData;
        if(countryFilteredData.length > 0){
            countryDataMap = countryFilteredData;
        }

        let globalDataMap = globalData;
        if(globalFilteredData.length > 0){
            globalDataMap = globalFilteredData;
        }

        const row = dataMap.map((item, index) => 
            <tr>
                <td>{index === 0 ? <FontAwesomeIcon icon={faStar} color="gold"/> : index  + 1.}</td>
                <td>{item.employeeID}</td>
                <td className="text-center">{item.membershipBreakdown.discovery}</td>
                <td className="text-center">{item.membershipBreakdown.explorer}</td>
                <td></td>
            </tr>
        );

        const countryRow = countryDataMap.map((item, index) => 
            <tr className = {hotelCode === item.RID ? 'active' : ''}>
                <td>{index === 0 ? <FontAwesomeIcon icon={faStar} color="gold"/> : index  + 1.}</td>
                <td>{item.vendorName} - RID {item.RID}</td>
                <td className="text-center">{item.membershipBreakdown.traveller ? item.membershipBreakdown.traveller : ''}</td>
                <td className="text-center">{item.membershipBreakdown.discovery ? item.membershipBreakdown.discovery : ''} </td>
                <td className="text-center">{item.membershipBreakdown.explorer ? item.membershipBreakdown.explorer : ''} </td>
            </tr>
        );

        const globalRow = globalDataMap.map((item, index) => 
        <tr className = {hotelCode === item.RID ? 'active' : ''}>
            <td>{index === 0 ? <FontAwesomeIcon icon={faStar} color="gold"/> : index  + 1.}</td>
            <td>
                <p className="mb-1 font-weight-bold">{item.vendorName}</p> 
                <p className="mb-0">RID {item.RID}</p></td>
            <td>{item.countryName}</td>
            <td className="text-center">{item.membershipBreakdown.traveller ? item.membershipBreakdown.traveller : ''}</td>
            <td className="text-center">{item.membershipBreakdown.discovery ? item.membershipBreakdown.discovery : ''} </td>
            <td className="text-center">{item.membershipBreakdown.explorer ? item.membershipBreakdown.explorer : ''} </td>
        </tr>
    );

        const filterByCountry = filterCountry.map((item) =>
            <option value={item}>{item}</option>
        ); 

        return (
            <div className="hotelSales-wrapper">
                <Header 
                    showLeaderBoard   = {showLeaderBoard}
                    hasGlobalMessage
                    />
                
                <div className="container leaderboard">
                    <button className="btn btn-secondary mt-4" onClick={()=> this.props.history.goBack()}>
                        <FontAwesomeIcon icon={faChevronLeft} /> Back
                    </button>
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
                                    <span class="info-box-number">{employeeData.total_units_sold}</span>
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
                                            dateFormat="dd - mm - yyyy"/>
                                </div>
                                <div className="col-12 col-md-4 mb-2 mb-md-0">
                                <button className="btn btn-primary btn-block" onClick={this.handleClick}>
                                        <FontAwesomeIcon icon={faSearch} /> SEARCH
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 mb-10">
                        <Tabs defaultActiveKey="dashboard" id="uncontrolled-tab-example">
                        <Tab eventKey="dashboard" title="DASHBOARD">
                                <div className = "row mt-4">
                                    <div className="col-md-6">
                                    </div>
                                    <div className="col-12 col-md-6 mb-3">
                                        <select className="form-control">
                                            <option>Weekly</option>
                                            <option>Monthly</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div class="card">
                                            <div class="card-header">
                                                <h3 class="card-title font-weight-bold">Membership Breakdown</h3>
                                            </div>
                                            <div class="card-body">
                                                <div class="row">
                                                <div class="col-md-8">
                                                    <PieChart
                                                        data={[
                                                            { title: 'Traveller', value: 10, color: '#E38627' },
                                                            { title: 'Explorer', value: 15, color: '#C13C37' },
                                                            { title: 'Discovery', value: 20, color: '#6A2135' },
                                                        ]}
                                                        radius={PieChart.defaultProps.radius - 6}
                                                        lineWidth={60}
                                                        segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                                                        segmentsShift={(index) => (index === selected ? 6 : 1)}
                                                        animate
                                                        label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                                                        labelPosition={100 - 60 / 2}
                                                        labelStyle={{
                                                            fill: '#fff',
                                                            opacity: 0.75,
                                                            pointerEvents: 'none',
                                                            fontSize:'0.75rem',
                                                            fontWeight:'700'
                                                        }}
                                                        totalValue={45}
                                                        onClick={(_, index) => {
                                                            this.setState({selected : index === selected ? undefined : index});
                                                          }}/>
                                                </div>
                                                <div class="col-md-4">
                                                    <ul class="chart-legend clearfix">
                                                        <li> <FontAwesomeIcon icon={faSquare} color={'#E38627'} /> Traveller </li>
                                                        <li> <FontAwesomeIcon icon={faSquare} color={'#C13C37'} /> Explorer</li>
                                                        <li> <FontAwesomeIcon icon={faSquare} color={'#6A2135'} /> Discovery</li>
                                                    </ul>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-8">
                                    <div class="card">
                                            <div class="card-header">
                                                <h3 class="card-title font-weight-bold"><FontAwesomeIcon icon={faStar}/> Top 5 Hotels</h3>
                                            </div>
                                            <div class="card-body">
                                                <table className="leaderboardTable table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{width: 10}}>#</th>
                                                            <th style={{width: 450}}>Hotel</th>
                                                            <th className="text-center" style={{width: 150}}>Traveller</th>
                                                            <th className="text-center" style={{width: 150}}>Discovery</th>
                                                            <th className="text-center" style={{width: 150}}>Explorer</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {countryDataMap.slice(0, 5).map((item, index) => 
                                                            <tr className = {hotelCode === item.RID ? 'active' : ''}>
                                                                <td>{index === 0 ? <FontAwesomeIcon icon={faStar} color="gold"/> : index  + 1.}</td>
                                                                <td>{item.vendorName} - RID {item.RID}</td>
                                                                <td className="text-center">{item.membershipBreakdown.traveller ? item.membershipBreakdown.traveller : ''}</td>
                                                                <td className="text-center">{item.membershipBreakdown.discovery ? item.membershipBreakdown.discovery : ''} </td>
                                                                <td className="text-center">{item.membershipBreakdown.explorer ? item.membershipBreakdown.explorer : ''} </td>
                                                            </tr>)} 
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="hotel" title="HOTEL">
                                <div className = "row mt-4">
                                    <div className="col-6">

                                    </div>
                                    <div className="col-12 col-md-6 input-group">
                                        <input type="text" placeholder="Search" className="form-control" onChange={this.handleChange}></input>
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faSearch} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <table className="leaderboardTable table mt-4 mb-5">
                                    <thead>
                                        <tr>
                                            <th style={{width: 10}}>#</th>
                                            <th style={{width: 200}}>Employee ID</th>
                                            <th className="text-center" style={{width: 150}}>Discovery</th>
                                            <th className="text-center" style={{width: 150}}>Explorer</th>
                                            <th className="text-center" style={{width: 150}}>Explorer Plus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {row}
                                    </tbody>
                                </table>
                            </Tab>
                            <Tab eventKey="country" title="COUNTRY">
                                <div className ="row mt-4">
                                    <div className="col-6">

                                    </div>
                                    <div className="col-12 col-md-6 input-group">
                                        <input type="text" placeholder="Search" className="form-control" onChange={this.handleCountrySearch}></input>
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faSearch} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <table className="leaderboardTable table mt-4 mb-5">
                                    <thead>
                                        <tr>
                                            <th style={{width: 10}}>#</th>
                                            <th style={{width: 450}}>Hotel</th>
                                            <th className="text-center" style={{width: 150}}>Traveller</th>
                                            <th className="text-center" style={{width: 150}}>Discovery</th>
                                            <th className="text-center" style={{width: 150}}>Explorer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {countryRow} 
                                    </tbody>
                                </table>
                            </Tab>
                            <Tab eventKey="global" title="GLOBAL" >
                                <div className ="row mt-4">
                                    <div className="col-12 col-md-4">
                                        <select className="form-control mb-4 mb-md-0" onChange={this.handleFilterCountrySearch}>
                                        <option value="all" selected>All</option>
                                            {filterByCountry}
                                        </select>
                                    </div>
                                    <div className="col-md-2">

                                    </div>
                                    <div className="col-12 col-md-6 input-group">
                                        <input type="text" placeholder="Search" className="form-control" onChange={this.handleGlobalSearch}></input>
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faSearch} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <table className="leaderboardTable table mt-4 mb-5">
                                    <thead>
                                        <tr>
                                            <th style={{width: 10}}>#</th>
                                            <th style={{width: 450}}>Hotel</th>
                                            <th style={{width: 150}}>Country</th>
                                            <th className="text-center" style={{width: 150}}>Traveller</th>
                                            <th className="text-center" style={{width: 150}}>Discovery</th>
                                            <th className="text-center" style={{width: 150}}>Explorer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {globalRow} 
                                    </tbody>
                                </table>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
        </div>
        );
    }
}

export default (LeaderBoard);
