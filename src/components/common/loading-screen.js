import React from 'react';

class LoadingScreen extends React.Component  {


    render() {
        const {extraClass} = this.props;
        return (
            <div className={`loading d-flex align-items-center justify-content-center ${extraClass}`}>
                <div className="row m-0 d-flex align-items-center justify-content-center">
                    <div class="spinner-border text-danger" role="status">
                        <span class="sr-only"></span>
                    </div>
                </div>
            </div>
        );
    }
}

export default (LoadingScreen);