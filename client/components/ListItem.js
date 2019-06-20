import React, { Component } from 'react';

const ListItem = (props) => {
        function starsHelper(rating){
            let starCharacter = '';
            for (let i = 0; i < Math.round(rating); i++){
                starCharacter+= '★';
            }
            for (let i = 0; i < 5-Math.round(rating);i++){
                starCharacter+='☆';
            }
            return starCharacter;
        }
      const formData = (
                        <li>
                        <div>
                        <h3>{props.el.name}</h3>  
                        <p className = 'address'>{props.el.location.address1}, {props.el.location.city}</p>
                        <p className = 'rating'>{starsHelper(props.el.rating)}, ({props.el.review_count}) ∙ {props.el.price}</p>
                        </div>
                        <input type='button' onClick = {() =>{props.onChoose(props.el)}} value = 'Choose'/>
                        
                        </li>)
      return (
       <div>{formData}</div>
      );
};

export default ListItem;