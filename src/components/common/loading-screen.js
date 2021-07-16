import React from 'react';

class LoadingScreen extends React.Component  {


    render() {
        const {show} = this.props;
        return (
            <div className={`loading d-flex align-items-center justify-content-center `}>
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