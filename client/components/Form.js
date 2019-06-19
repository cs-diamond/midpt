import React, { useState } from 'react';
import Input from '../components/Input';

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
  const [numLocationInputs, setNumLocationInputs] = useState(1);

  const renderLocationInputs = () => {
    return Array.from({ length: numLocationInputs }, () => {
      return (
        <div className="locInputs">
          <Input
            key="a"
            keyName="a"
            onChange={props.onChange}
            placeholder={props.placeholder}
          />
          <Input
            key="b"
            keyName="b"
            onChange={props.onChange}
            placeholder={props.placeholder}
          />
        </div>
      );
    });
  };

  let buttonSpace;
  if (!props.loading) {
    buttonSpace = (
      <input type="button" value="Find Midpoint →" onClick={props.onClick} />
    );
  } else {
    buttonSpace = <img src="/loading.gif" />;
  }
  return (
    <form id="form">
      <button className="moreAddressesButton">+</button>
      {renderLocationInputs()}
      <div className="locButtons">
        <div className="timeRadio">
          <span>Leaving</span>
          <input
            type="radio"
            name="leaving"
            id="now"
            value={0}
            onClick={props.onRadioChange}
          />
          <label htmlFor="now">Now</label>
          <input
            type="radio"
            name="leaving"
            id="p30min"
            value={30 * 60}
            onClick={props.onRadioChange}
            defaultChecked="true"
          />
          <label htmlFor="p30min">{'In 30 mins'}</label>
          <input
            type="radio"
            name="leaving"
            id="p1hr"
            value={60 * 60}
            onClick={props.onRadioChange}
          />
          <label htmlFor="p1hr">{'In 1 hour'}</label>
          <input
            type="radio"
            name="leaving"
            id="other"
            value="other"
            onClick={props.onRadioChange}
          />
          <label htmlFor="other">
            <input
              type="text"
              id="otherText"
              placeholder="Other..."
              onChange={() => onOther(props.radioVal, props.onRadioChange)}
              onClick={() => onOther(props.radioVal, props.onRadioChange)}
              pattern="(1[0-2]|0?[1-9]):[0-5][0-9]"
            />
          </label>
        </div>
        {buttonSpace}
      </div>
    </form>
  );
};

// onClick={() => selectOnInput(props.onRadioChange)}

export default Form;
