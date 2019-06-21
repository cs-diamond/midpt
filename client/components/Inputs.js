import React, { useState } from 'react';
import Input from './Input';
const Inputs = props => {
  const { numLocationInputGroups, onChange, locInput0a, locInput0b } = props;
  const PLACEHOLDERS = {
    active: 'Enter an address...',
    inactive: 'Another one...',
  };
  const renderLocationInputs = () => {
    return Array.from({ length: numLocationInputGroups }, (_, index) => {
      return (
        <div className="locInputs">
          <Input
            key={`locInput${index}a`}
            keyName={`locInput${index}a`}
            onChange={onChange}
            placeholder={PLACEHOLDERS.active}
            locInput0a={locInput0a}
          />
          <Input
            key={`locInput${index}b`}
            keyName={`locInput${index}b`}
            onChange={onChange}
            placeholder={PLACEHOLDERS.inactive}
            locInput0b={locInput0b}
          />
        </div>
      );
    });
  };
  return <div className="locInputGroup">{renderLocationInputs()}</div>;
};

export default Inputs;
