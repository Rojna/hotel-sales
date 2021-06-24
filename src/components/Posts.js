import React, {Component} from 'react';
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Loading from "./Loading";
import Divider from '@material-ui/core/Divider';

class Posts extends Component {


    render() {
        return (
            (this.props.loading ? <Loading/> :
                    <List>
                        {
                            this.props.posts.map((post, index) =>
                                <>
                                    <ListItem className='post-list' button key={index}
                                              onClick={() => this.props.handleClick(post)}>
                                        <ListItemText primary={post.airportName + ',  ' + post.country.countryName}/>
                                    </ListItem>
                                    <Divider />
                                </>
                            )
                        }
                    </List>
            ));
    }
};

export default Posts;