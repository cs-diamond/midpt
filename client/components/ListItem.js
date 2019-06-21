import React, {Component} from 'react';

const ListItem = (props) => {
  function starsHelper(rating) {
    let starCharacter = '';
    for (let i = 0; i < Math.round(rating); i++) {
      starCharacter += '★';
    }
    for (let i = 0; i < 5 - Math.round(rating); i++) {
      starCharacter += '☆';
    }
    return starCharacter;
  }
  const line1 = (props.el.location.address1) ? props.el.location.address1 + ', ' + props.el.location.city : props.el.location.city;
  const line2 = starsHelper(props.el.rating) + ' ' + props.el.review_count + ' ∙ ' + props.el.price;
  const formData = (
    <li>
      <figure>{props.rank}</figure>
      <div>
        <h3>{props.el.name}</h3>
        <p className="address">{line1}</p>
        <p className="rating">{line2}</p>
      </div>
      <input type="button" onClick={() =>{props.onChoose(props.el)}} value="Choose" />
    </li>
  );
  return formData;
};

export default ListItem;
