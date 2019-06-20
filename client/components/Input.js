import React from 'react';

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
        value={props.locInput0a ? props.locInput0a : props.locInput0b}
      />
    </div>
  );
};

export default Input;
