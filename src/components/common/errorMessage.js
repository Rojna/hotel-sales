import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'


class ErrorMessage extends React.Component  {
    render() {
        return (
            <div class="alert alert-warning alert-dismissible">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h5><FontAwesomeIcon icon={faExclamationTriangle}/> Alert!</h5>
                Could not load data
            </div>

        );
    }
}

export default (ErrorMessage);