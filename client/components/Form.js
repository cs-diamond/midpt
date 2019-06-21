import React, { useState } from 'react';
import Spinner from 'react-spinkit';
import Inputs from './Inputs';
import Icon from './Icon';
import colors from '../scss/colors';

const onOther = (prevChecked, callback) => {
  const textField = document.getElementById('otherText');
  const radioButton = document.getElementById('other');
  const isValid = textField.checkValidity() && textField.value !== '';
  if (isValid) {
    radioButton.checked = true;
    const time = textField.value.split(':');
    let event = new Date();
    const wantedHour = Number(time[0]);
    const wantedMin = Number(time[1]);
    const currHours = event.getHours();
    if (currHours > 12) {
      event.setHours(12 + wantedHour);
    } else {
      event.setHours(wantedHour);
    }
    event.setMinutes(wantedMin);
    const now = new Date();
    let diff = Math.abs(event.getTime() - now.getTime());
    diff = diff / 1000;
    const e = {};
    e.target = {};
    e.target.value = diff;
    // don't change radioName: its only use is for this function
    e.target.id = prevChecked;
    callback(e);
  }
  if (!isValid && radioButton.checked) {
    document.getElementById(prevChecked).checked = true;
  }
};

const Form = props => {
  const {
    onChange,
    onClick,
    onRadioChange,
    radioVal,
    loading,
    yelpCategory,
    handleYelpCategoryInput,
    yelpCategoryMatches,
    selectYelpCategoryMatch,
    getUserCurrentCoords,
    locInput0a,
    locInput0b,
    locationLoading,
  } = props;
  const [numLocationInputGroups, setNumLocationInputGroups] = useState(1);

  const addMoreAddressInputs = () => {
    event.preventDefault();
    setNumLocationInputGroups(numLocationInputGroups + 1);
  };

  const renderButton = () => {
    return loading ? (
      <img src="/loading.gif" />
    ) : (
      <input
        className="button findMidptButton"
        id="formSubmitButton"
        type="button"
        value="Find Midpoint →"
        onClick={onClick}
      />
    );
  };

  const renderYelpCategoryMatches = () => {
    return yelpCategoryMatches.map(category => {
      if (yelpCategoryMatches === []) return null;
      return <li onClick={e => selectYelpCategoryMatch(e)}>{category}</li>;
    });
  };

  return (
    <form id="form" className="formContainer">
      <div className="formFlexGroup">
        <button className="locationPointer" onClick={getUserCurrentCoords}>
          {locationLoading ? (
            <Spinner fadeIn="none" name="pulse" color={colors.blue} />
          ) : (
            <Icon name="location-pointer" color={colors.blue} width={18} />
          )}
        </button>
        <Inputs
          numLocationInputGroups={numLocationInputGroups}
          onChange={onChange}
          locInput0a={locInput0a}
          locInput0b={locInput0b}
        />
        <div className="locButtons">
          <div className="timeRadio">
            <span className="inputLabel">Leaving</span>
            <input
              type="radio"
              name="leaving"
              id="now"
              value={0}
              onClick={onRadioChange}
            />
            <label htmlFor="now">Now</label>
            <input
              type="radio"
              name="leaving"
              id="p30min"
              value={30 * 60}
              onClick={onRadioChange}
              defaultChecked="true"
            />
            <label htmlFor="p30min">{'In 30 mins'}</label>
            <input
              type="radio"
              name="leaving"
              id="p1hr"
              value={60 * 60}
              onClick={onRadioChange}
            />
            <label htmlFor="p1hr">{'In 1 hour'}</label>
            <input
              type="radio"
              name="leaving"
              id="other"
              value="other"
              onClick={onRadioChange}
            />
            <label htmlFor="other">
              <input
                type="text"
                id="otherText"
                placeholder="Other..."
                onChange={() => onOther(radioVal, onRadioChange)}
                onClick={() => onOther(radioVal, onRadioChange)}
                pattern="(1[0-2]|0?[1-9]):[0-5][0-9]"
              />
            </label>
          </div>
          <div className="yelps">
            <div className="locInput">
              <label htmlFor="yelpCategory">Meet at </label>
              <input
                type="text"
                id="yelpCategory"
                placeholder="Enter a category..."
                className="locInput"
                onChange={e => handleYelpCategoryInput(e, yelpCategory)}
              />
            </div>
          </div>
        </div>
      </div>
      {renderButton()}
    </form>
  );
};

// onClick={() => selectOnInput(props.onRadioChange)}

// <button
//   onClick={addMoreAddressInputs}
//   className="button moreAddressesButton"
// >
//   <Icon name="plus" color={colors.blue} />
// </button>

// <span className="inputLabel yelpCategory">Meet at</span>
// <label className="yelpCategory" htmlFor="yelp-category">
//   <div className="yelpCategory">
//     <input
//       type="text"
//       id="yelpCategory"
//       placeholder="Enter a category..."
//       className="locInput"
//       onChange={e => handleYelpCategoryInput(e, yelpCategory)}
//     />
//     <ul className="yelpCategoryMatches">
//       {renderYelpCategoryMatches()}
//     </ul>
//   </div>
// </label>

export default Form;
