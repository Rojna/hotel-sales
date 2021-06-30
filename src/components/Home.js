import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';
import Welcome from './Welcome';
import HotelSearchModal from './HotelSearchModal';
import Benefits from './Benefits.js';

import { HOTELSEARCH_CODEURL, COUNTRYCODES } from './../constants/index';
import { getCountry, setBenefits, setLanguage } from './Helper.js';

import auData from '../data/benefits.json';
import idData from '../data/benefits.json';
import myData from '../data/benefits.json';
import thData from '../data/benefits.json';
import vnData from '../data/benefits.json';

import languages from '../data/language.json';
import '../css/style.css';

class Home extends Component {
    constructor(props) {
        super(props);
        const region = this.props.location.pathname.split('/')[1] || 'au';
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
            language           : setLanguage(region, languages)
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
                console.log(response.data[0].HotelCode);
                if (response.status === 200) {
                    this.setState({
                        hotelSearch        : true,
                        hotelSearchResults : true,
                        hotelCode          : response.data[0].HotelCode,
                        hotelName          : response.data[0].HotelName
                    });
                    localStorage.setItem('hotelData',JSON.stringify(response.data[0]));
                    const country = getCountry(response.data[0].CountryCode, COUNTRYCODES);
                    this.setState({countryCode : country.country_code});
                    localStorage.setItem('countryCode',this.state.countryCode);
                    this.setState({benefitResults : setBenefits(response.data[0].CountryCode, benefitsData)});
                    this.hideModal();
                } else throw new Error('Oops, something went wrong');
            }).catch(error => {
                this.setState({
                    hotelSearch        : true,
                    hotelSearchResults : false
                });
        });
    };

    handleNext = () => {
        const {hotelCode , hotelName, benefitResults, language} =this.state;
        var url;;
        switch(this.state.region){
            case 'id':
                url = "/id";
                break;
            case 'my':
                url = "/my";
                break;
            case 'th':
                url = "/th";
                break;   
            case 'vn':
                url = "/vn";
                break;   
            default:
                url = "";
                break;
        } 
        if(hotelCode && localStorage.getItem('hotelData')){
            this.props.history.push(url+'/employee-details', { 
                hotelCode      : hotelCode, 
                hotelName      : hotelName,
                benefitResults : benefitResults,
                language       : language
            });
        }else{
            this.setState({showError: true});
        }
    };

    handleChange = (e) => {
        this.setState({hotelCode: e.target.value});
    };

    async saveHotelSearch(code){
        await this.setState({ hotelCode: code });
        this.handleClick();
    }

    handleLeaderBoard = () => {
        if(this.state.showLeaderBoard){
            this.props.history.push('/leaderboard', { 
                hotelCode      : this.state.hotelCode, 
                hotelName      : this.state.hotelName
            });
        }
    }

    render() {
        const {hotelSearch, hotelSearchResults, hotelName, hotelCode, show, benefitResults, showError, language, showLeaderBoard} = this.state;
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
                    handleNext   = {this.handleNext} />
               
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