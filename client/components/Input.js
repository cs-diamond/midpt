import React, { Component } from 'react';

const Input = props => {
  return (
    <div className="locInput">
      <label htmlFor={props.keyName}>📍</label>
      <input
        type="text"
        id={props.keyName}
        name={props.keyName}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default Input;
