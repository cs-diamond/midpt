import React, { Component } from 'react';
import ListItem from './ListItem';

const List = (props) => {
    let listCategories = [];
    if (props.result){
    if (props.result.yelps.length!==0){   
        
        props.result.yelps.forEach(el=>{
            listCategories.push(<ListItem el = {el} onChoose = {props.onChoose}/>);
        });
    }
}
      return (
        <div className = 'list'>{listCategories}</div>
      );
};

export default List;