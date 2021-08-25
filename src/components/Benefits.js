import React from 'react';
import { Accordion, Card } from "react-bootstrap";

class Benefits extends React.Component  {
    render() {
        const {data} = this.props;
        var benefits;
        if(data.benefits){
            benefits = data.benefits.map((item, index) =>
                    <Card key={index} className="benefits">
                        <Accordion.Toggle as={Card.Header} eventKey={index+1}>
                            <div className="d-flex ">
                                <div className="mb-0 col-11 d-block d-md-none">
                                    {item.subtitle}
                                </div>
                                <div className="mb-0 col-1 d-block d-md-none">
                                    <img alt= "plus-symbol" src="/images/plus-symbol.png" width="22" />
                                </div>
                                <div className="mb-0 col-5 d-none d-md-block">
                                    {item.subtitle}
                                </div>
                                {item && item.traveller && (
                                    <div className="col-4 col-md-2 text-center">
                                        {item.traveller.content === false && (
                                            <img alt= "plus-symbol" src={item.traveller.image} width="15"/>
                                        )}
                                        {item.traveller.content !== false && (item.traveller.content)}
                                    </div>
                                )}
                                {item && item.explorer && (
                                    <div className="col-4 col-md-2 text-center">
                                        {item.explorer.content === false && (
                                            <img alt= "plus-symbol" src={item.explorer.image} width="15"/>
                                        )}
                                        {item.explorer.content !== false && (item.explorer.content)}
                                    </div>
                                )}
                                {item && item.discovery && (
                                    <div className="col-4 col-md-2 text-center">
                                        {item.discovery.content === false && (
                                            <img alt= "plus-symbol" src={item.discovery.image} width="15"/>
                                        )}
                                        {item.discovery.content !== false && (item.discovery.content)}
                                    </div>
                                )}
                                <div className="mb-0 col-1 d-none d-md-block">
                                    <img alt= "plus-symbol" src="/images/plus-symbol.png" width="22" />
                                </div>   
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={index+1}>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div>{item.description}</div>
                                        <div>{item.learnmore && (
                                            <a target='_blank' rel="noreferrer" href={item.learnmore.link}>{item.learnmore.text}</a>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                );
        }

        return (
            <div className="container accordion-container mt-5 benefits-container mb-5">
                    <h4 className="col-12 benefits-header d-block d-md-none h4">{data.title}</h4>
                    {data.products && (
                        <div className="d-flex benefits-header-container">
                        <h4 className="col-5 benefits-header d-none d-md-block h4">{data.title}</h4>
                        {data.products && data.products.traveller && (
                                <div className="col-4 col-md-2 text-center">
                                    <div><img alt= "" src={data.products.traveller.image} width="50"/></div>
                                    <div>{data.products.traveller.name}</div>
                                    <div>{data.products.traveller.price}</div>
                                </div>
                        )}
                        {data.products && data.products.explorer && (
                                <div className="col-4 col-md-2 text-center">
                                    <div><img alt= "" src={data.products.explorer.image} width="50"/></div>
                                    <div>{data.products.explorer.name}</div>
                                    <div>{data.products.explorer.price}</div>
                                </div>       
                        )}
                        {data.products && data.products.discovery && (
                                <div className="col-4 col-md-2 text-center">
                                    <div><img alt= "" src={data.products.discovery.image} width="50"/></div>
                                    <div>{data.products.discovery.name}</div>
                                    <div>{data.products.discovery.price}</div>
                                </div>
                        )}
                    </div>
                    )}
                    <Accordion defaultActiveKey="0">
                        {benefits}
                    </Accordion>
            </div>  
        );   
    }    
}

export default (Benefits);