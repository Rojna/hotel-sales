import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';
import Welcome from './Welcome';
import HotelSearchModal from './HotelSearchModal';
import LoadingScreen from './common/loading-screen';
import Benefits from './Benefits.js';

import { HOTELSEARCH_CODEURL, COUNTRYCODES, DOMAINS, MAP_COUNTRYCODES, MAP_COUNTRYLOGO} from './../constants/index';
import { getCountry, setBenefits, setLanguage } from './helper';

import auData from '../data/benefits.json';
import idData from '../data/id/benefits.json';
import myData from '../data/my/benefits.json';
import thData from '../data/th/benefits.json';
import vnData from '../data/vn/benefits.json';

import languages from '../data/language-test.json';
import '../css/style.css';
import { templateSettings } from 'lodash';

class Home extends Component {
    constructor(props) {
        super(props);
        const region = this.props.location.pathname.split('/')[1] || 'au';
        var getLanguage='';
        if(localStorage.getItem('hotelData')){
            getLanguage = setLanguage(region, JSON.parse(localStorage.getItem('languages')));
        }else{
            getLanguage = setLanguage(region, languages);
        }
        
        this.state = {
            show               : false,
            showLeaderBoard    : false,
            hotelSearch        : false,
            hotelSearchResults : false,
            countryCode        : '',
            edYpos             : '',
            hotelCode          : '',
            hotelName          : '',
            region             : region,
            benefitResults     : {},
            showError          : false,
            language           : getLanguage
        };
        
        this.showModal         = this.showModal.bind(this);
        this.hideModal         = this.hideModal.bind(this);
        this.handleClick       = this.handleClick.bind(this);
        this.handleNext        = this.handleNext.bind(this);
        this.handleLeaderBoard = this.handleLeaderBoard.bind(this);
        this.saveHotelSearch   = this.saveHotelSearch.bind(this);

    }
        
    componentDidMount = () => {
        const {hotelCode , hotelName, benefitResults, language} =this.state;
        const { history } = this.props;
        if(localStorage.getItem('hotelData')){
            const hotelData = JSON.parse(localStorage.getItem('hotelData'));
            this.setState({
                hotelSearch        : true,
                hotelSearchResults : true,
                hotelCode          : hotelData.HotelCode,
                hotelName          : hotelData.HotelName,
                countryCode        : localStorage.getItem('countryCode'),
                showLeaderBoard    : true
            },() => {
                this.handleClick(); 
            });
        }
    }

    showModal = (e) => {
        e.preventDefault();
        this.setState({ show: true });
      };
    
    hideModal = () => {
        this.setState({ show: false });
    };

    handleClick = () => {
        console.log('Handle click');
        console.log('hotel Code', this.state.hotelCode);

        var benefitsData;
        switch(this.state.region){
            case 'id':
                benefitsData = idData;
                break;
            case 'my':
                benefitsData = myData;
                break;
            case 'th':
                benefitsData = thData;
                break;   
            case 'vn':
                benefitsData = vnData;
                break;   
            default:
                benefitsData = auData;
                break;
        } 

        axios.get(`${HOTELSEARCH_CODEURL}?HotelCode=${this.state.hotelCode}`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        hotelSearch        : true,
                        hotelSearchResults : true,
                        hotelCode          : response.data[0].HotelCode,
                        hotelName          : response.data[0].HotelName,
                        countryName        : response.data[0].CountryName
                    });
                    localStorage.setItem('hotelData',JSON.stringify(response.data[0]));
                    const country = getCountry(response.data[0].CountryCode, COUNTRYCODES);
                    this.setState({countryCode : country.country_code});
                    localStorage.setItem('countryCode',this.state.countryCode);
                    this.setState({
                        benefitResults : setBenefits(response.data[0].CountryCode, benefitsData,),
                        showLeaderBoard : true
                    });
                    this.hideModal();
                } 
            }).catch(error => {
                this.setState({
                    hotelSearch        : true,
                    hotelSearchResults : false,
                    hotelName          : '',
                    countryName        : '',
                    showLeaderBoard    : false,
                    benefitResults     : {}
                });
                localStorage.removeItem('hotelData');
                localStorage.removeItem('countryCode');
        });
    };

    handleNext = () => {
        const {hotelCode , hotelName, benefitResults, language, showLeaderBoard, hotelSearch, hotelSearchResults} =this.state;
        const url = (this.state.region == 'au' ? '': '/'+this.state.region);
        if(hotelCode && hotelSearch && localStorage.getItem('hotelData')){
            this.props.history.push(url+'/employee-details', { 
                hotelCode         : hotelCode, 
                hotelName         : hotelName,
                benefitResults    : benefitResults,
                language          : language,
                showLeaderBoard   : showLeaderBoard
            });
        }else{
            this.setState({showError: true});
        }
    };

    handleChange = (e) => {
        this.setState({
            hotelSearch        : false,
            hotelCode          : e.target.value,
            showLeaderBoard    : false
        });
    };

    async saveHotelSearch(code){
        await this.setState({ hotelCode: code });
        this.handleClick();
    }

    handleLeaderBoard = () => {
        if(this.state.showLeaderBoard){
            this.props.history.push('/leaderboard', { 
                hotelCode      : this.state.hotelCode, 
                hotelName      : this.state.hotelName,
                countryName    : this.state.countryName
            });
        }
    }

    render() {
        const {hotelSearch, hotelSearchResults, hotelName, hotelCode, show, benefitResults, showError, language, showLeaderBoard, region} = this.state;
        let translateLanguage = [];
        if(localStorage.getItem('languages')){
            const index=0;
            const domains = JSON.parse(localStorage.getItem('languages'));
            Object.entries(domains).map(([key, i]) => {
                 const test={};
                 test[0] = key;
                 test[1] = key === "au" ? "English" : MAP_COUNTRYCODES[key.toUpperCase()];
                 translateLanguage.push(test);
            });
        }else{
            DOMAINS.map((key) => {
                translateLanguage[key] = MAP_COUNTRYCODES[key.toUpperCase()];
            });
        }
        return (
            <div className="hotelSales-wrapper">
                <Header 
                    showLeaderBoard   = {showLeaderBoard}
                    handleLeaderBoard = {this.handleLeaderBoard}/> 
                <Welcome
                    language    = {language} 
                    showError   = {showError}
                    hotelCode   = {hotelCode}
                    hotelName   = {hotelName}
                    hotelSearch = {hotelSearch}
                    hotelSearchResults = {hotelSearchResults}
                    handleClose = {this.hideModal} 
                    save        = {this.saveHotelSearch}
                    showModal   = {this.showModal}
                    handleClick = {this.handleClick}
                    handleChange = {this.handleChange}
                    handleNext   = {this.handleNext}
                    translateLanguage = {translateLanguage}
                    region = {region} />
               
                <Benefits data = {benefitResults}/>
                <HotelSearchModal 
                    show        = {show}  
                    language    = {language}
                    handleClose = {this.hideModal} 
                    save        = {this.saveHotelSearch} />
        </div>
        );
    }
}

export default (Home);
