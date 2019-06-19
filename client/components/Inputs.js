import React, { useState } from 'react';
import Input from './Input';
const Inputs = props => {
  const { numLocationInputGroups, onChange } = props;
  const PLACEHOLDERS = {
    active: 'Enter an address...',
    inactive: 'Another one...',
  };
  const renderLocationInputs = () => {
    return Array.from({ length: numLocationInputGroups }, (_, index) => {
      return (
        <div className="locInputs">
          <Input
            key={`loc-input-${index}-a`}
            keyName={`loc-input-${index}-a`}
            onChange={onChange}
            placeholder={PLACEHOLDERS.active}
          />
          <Input
            key={`loc-input-${index}-b`}
            keyName={`loc-input-${index}-b`}
            onChange={onChange}
            placeholder={PLACEHOLDERS.inactive}
          />
        </div>
      );
    });
  };
  return <div className="locInputGroup">{renderLocationInputs()}</div>;
};

export default Inputs;
