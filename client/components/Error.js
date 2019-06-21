import React from 'react';

const Error = props => {
  return (
    <div className="errorContainer scale-up-center">
      <div className="errorMessage">
        <strong>Error</strong>
        <p>{props.error}</p>
      </div>
      <button onClick={props.closeError}>OK</button>
    </div>
  );
};

export default Error;
