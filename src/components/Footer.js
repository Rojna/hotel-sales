import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';

class Footer extends Component {
    render() {
        return (
            <footer className='footer'>
                <Typography component="p">
                    @2019 All right reserved
                </Typography>
            </footer>
        );
    }
};


export default (Footer);