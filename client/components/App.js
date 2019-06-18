import React, { Component } from 'react';
import Maps from '../components/Maps';
import Form from '../components/Form';

function getInitialState() {
  return {
    placeholder: 'Enter an address...',
    radioName: 'p30min',
    radioVal: 30 * 60,
    showForm: true
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
  }
  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  onClick(e) {
    console.log(this.state.loca + ' 📍 ' + this.state.locb);
    console.log('Leaving in +' + this.state.radioVal + ' seconds');
    let departureTime = new Date(Date.now() + this.state.radioVal * 1000);
    departureTime = departureTime.toISOString();
    console.log('(' + departureTime + ')');
    const data = {
      points: [this.state.loca, this.state.locb],
      departureTime: departureTime
    };
    this.setState({ loading: true });
    fetch('http://localhost:3000/buildroute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        console.log('raw server response', response);
        return response.json();
      })
      .then(data => {
        this.setState({ loading: false });
        console.log('data', data);
        this.setState({
          result: {
            point1: data.points[0],
            point2: data.points[1],
            midpt: data.midpt,
            aToMidptURL: data.directionURLs[0],
            bToMidptURL: data.directionURLs[1],
            address1: data.addresses[0],
            address2: data.addresses[1],
            isochrones: data.isochrones
          },
          showForm: false
        });
      });
  }
  onRadioChange(e) {
    this.setState({
      radioVal: [e.target.value],
      radioName: [e.target.id]
    });
  }
  hasUpdatedMap() {
    this.setState({ shouldUpdateMap: false });
  }
  render() {
    let form;
    if (this.state.showForm) {
      form = (
        <Form
          onChange={this.onChange}
          onClick={this.onClick}
          radioVal={this.state.radioName}
          onRadioChange={this.onRadioChange}
          placeholder={this.state.placeholder}
          loading={this.state.loading}
        />
      );
    } else {
      form = '';
    }
    return (
      <div className="App">
        <h1>midpt</h1>
        {form}
        <Maps result={this.state.result} />
      </div>
    );
  }
}

export default App;
