import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Footer from "./Footer";
import '../css/style.css';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';

class EmployeeDetail extends Component {

    render() {
        return (
            <div className='detail-container'>
                    {this.props.postDetail &&
                                <Table className='table' aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" > Name</TableCell>
                                            <TableCell>{this.props.postDetail.airportName+' ['+
                                            this.props.postDetail.airportCode+']'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" > Time Zone</TableCell>
                                            <TableCell>{this.props.postDetail.city.timeZoneName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component='th'>International</TableCell>
                                            <TableCell>{this.props.postDetail.internationalAirport ? <CheckIcon/>:<CancelIcon />}</TableCell>
                                            </TableRow>
                                        <TableRow>
                                            <TableCell component='th'>Domestic</TableCell>
                                            <TableCell>{this.props.postDetail.domesticAirport ? <CheckIcon />:<CancelIcon />}</TableCell>
                                            </TableRow>
                                        <TableRow>
                                            <TableCell component='th'>Regional</TableCell>
                                            <TableCell>{this.props.postDetail.regionalAirport ? <CheckIcon />:<CancelIcon />}</TableCell>
                                            </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row"> Location</TableCell>
                                            <TableCell>
                                                {this.props.postDetail.city.cityName + ', ' +
                                                this.props.postDetail.country.countryName + ' [' +
                                                this.props.postDetail.country.countryCode+'], '+
                                                this.props.postDetail.region.regionName
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th"> Latitude / Longitude</TableCell>
                                            <TableCell>{this.props.postDetail.location.latitude + '° ' +
                                            (this.props.postDetail.location.latitudeDirection  ? this.props.postDetail.location.latitudeDirection :'') + ' / ' +
                                            this.props.postDetail.location.longitude+'° '+
                                            (this.props.postDetail.location.longitudeDirection ? this.props.postDetail.location.longitudeDirection:'' )
                                            }</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                }
                <Button className='back-button' onClick={()=>this.props.toggleDisplayStatus(1)} variant="contained" color="primary"> Go Back</Button>
                <Footer/>
            </div>
        );
    }

}

export default EmployeeDetail;
