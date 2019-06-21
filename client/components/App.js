import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Spinner from 'react-spinkit';
import axios from 'axios';
import Maps from './Maps';
import Form from './Form';
import List from './List';
import GoogleAuth from './GoogleAuth';
import Share from './Share';
import Error from './Error';
import colors from '../scss/colors';

const YELP_CATEGORIES = ['Cafes', 'Restaurants', 'Bars'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCurrentCoords: null,
      radioName: 'p30min',
      radioVal: 30 * 60,
      showForm: true,
      yelpCategory: '',
      yelpCategoryMatch: '',
      yelpCategoryMatches: [],
      midptInfo: {},
      submitButton: true,
      signedInUserEmail: null,
      signedInUserFirstName: null,
      signedInUserProfilePic: null,
      locationLoading: false,
      showError: false,
      errorMessage:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint iusto sit vero voluptatum nam itaque rerum dignissimos recusandae, enim obcaecati nobis voluptate mollitia fugiat sapiente fuga doloremque quisquam, tenetur laudantium!',
    };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.handleYelpCategoryInput = this.handleYelpCategoryInput.bind(this);
    this.displayYelpMatches = this.displayYelpMatches.bind(this);
    this.findMatches = this.findMatches.bind(this);
    this.selectYelpCategoryMatch = this.selectYelpCategoryMatch.bind(this);
    this.getUserCurrentCoords = this.getUserCurrentCoords.bind(this);
    this.onGoogleSuccess = this.onGoogleSuccess.bind(this);
    this.onGoogleFailure = this.onGoogleFailure.bind(this);
    this.initGoogleAuth = this.initGoogleAuth.bind(this);
    this.signOut = this.signOut.bind(this);
    this.onChoose = this.onChoose.bind(this);
    this.checkForm = this.checkForm.bind(this);
    this.closeError = this.closeError.bind(this);
  }

  checkForm() {
    let box1 = document.getElementById('locInput0a').value;
    let box2 = document.getElementById('locInput0b').value;
    if (
      box1.toUpperCase() == box2.toUpperCase() ||
      box1.length == 0 ||
      box2.length == 0
    ) {
      console.log('if statement');
      document.getElementById('formSubmitButton').classList.add('buttonNo');
      this.setState({ submitButton: false });
    } else {
      console.log('else statement');
      document.getElementById('formSubmitButton').classList.remove('buttonNo');
      this.setState({ submitButton: true });
    }
    console.log('checkform gets through');
  }

  componentDidMount() {
    this.checkForm();
  }
  initGoogleAuth() {
    window.gapi.load('auth2', () => {
      window.gapi.auth2
        .init({
          client_id:
            '706985961819-lfqvbdctqu7v8a8q868u72qgnm4mltnb.apps.googleusercontent.com',
        })
        .then(() => {
          window.gapi.signin2.render('google-signin', {
            scope: 'profile email',
            width: 120,
            height: 30,
            longtitle: false,
            theme: 'dark',
            onsuccess: this.onGoogleSuccess,
            onfailure: this.onGoogleFailure,
          });
        });
    });
  }

  onGoogleSuccess(googleUser) {
    console.log('Signing into Google!');
    const profile = googleUser.getBasicProfile();
    console.log(`Welcome, ${profile.getName()}`);
    const token = googleUser.getAuthResponse().id_token;
    axios
      .post('/api/auth/google', {
        token,
      })
      .then(({ data }) => {
        this.setState({
          signedInUserEmail: profile.getEmail(),
          signedInUserFirstName: profile.getGivenName(),
          signedInUserProfilePic: profile.getImageUrl(),
        });
        console.log(data);
      })
      .catch(error => {
        console.log(error);
        this.setState({
          showError: true,
          errorMessage: 'Oops!',
        });
      });
  }

  onGoogleFailure(error) {
    console.log(error);
  }

  signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      this.setState(
        {
          signedInUserEmail: null,
        },
        () => {
          this.initGoogleAuth();
        }
      );
      console.log('User signed out.');
    });
  }

  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
    this.checkForm();
  }

  onChoose(el) {
    window.scrollTo(0, 0);
    this.setState({ midptInfo: el });
  }

  closeError() {
    this.setState({
      showError: false,
      errorMessage: '',
    });
  }

  findMatches(categoryToMatch, categories) {
    return categories.filter(category => {
      const regex = new RegExp(categoryToMatch, 'gi');
      return category.match(regex);
    });
  }

  displayYelpMatches(value) {
    const matchArray = this.findMatches(value, YELP_CATEGORIES);
    return matchArray;
  }

  handleYelpCategoryInput(e, value) {
    const matches = this.displayYelpMatches(value);
    this.setState({
      yelpCategory: e.target.value,
      yelpCategoryMatches: matches,
    });
  }

  selectYelpCategoryMatch(e) {
    this.setState({ yelpCategoryMatch: e.target.innerText });
  }

  getUserCurrentCoords() {
    event.preventDefault();
    this.setState({
      locationLoading: true,
    });
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = pos => {
      initGeolocation(pos.coords.latitude, pos.coords.longitude);
    };
    const error = err => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);

    const initGeolocation = (lat, lng) => {
      let geocoder = new window.google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode(
        {
          latLng: latlng,
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              this.setState({
                locInput0a: results[1].formatted_address,
                locationLoading: false,
              });
            } else {
              alert('No results found');
            }
          } else {
            alert('Geocoder failed due to: ' + status);
          }
        }
      );
    };
  }

  onClick(e) {
    if (this.state.submitButton) {
      console.log(this.state.locInput0a + ' 📍 ' + this.state.locInput0b);
      console.log('Leaving in +' + this.state.radioVal + ' seconds');
      let departureTime = new Date(Date.now() + this.state.radioVal * 1000);
      departureTime = departureTime.toISOString();
      console.log('(' + departureTime + ')');
      const data = {
        points: [this.state.locInput0a, this.state.locInput0b],
        departureTime: departureTime,
        yelpCategory: this.state.yelpCategory,
        userCurrentCoords: this.state.userCurrentCoords,
      };
      this.setState({ showForm: false });
      fetch('/api/buildroute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
              isochrones: data.isochrones,
              yelps: data.filteredYelpData,
            },
            showForm: false,
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({ showForm: true });
        });
    }
  }

  onRadioChange(e) {
    this.setState({
      radioVal: [e.target.value],
      radioName: [e.target.id],
    });
  }

  hasUpdatedMap() {
    this.setState({ shouldUpdateMap: false });
  }

  render() {
    const {
      showForm,
      yelpCategory,
      yelpCategoryMatches,
      signedInUserEmail,
      signedInUserFirstName,
      signedInUserProfilePic,
      showError,
      locationLoading,
      errorMessage,
    } = this.state;
    return (
      <div className="App">
        {showError && (
          <Error closeError={this.closeError} error={errorMessage} />
        )}
        <GoogleAuth
          signOut={this.signOut}
          signedInUserEmail={signedInUserEmail}
          signedInUserFirstName={signedInUserFirstName}
          signedInUserProfilePic={signedInUserProfilePic}
          initGoogleAuth={this.initGoogleAuth}
        />
        <h1 className="logo">midpt</h1>
        {showForm ? (
          <Form
            checkForm={this.checkForm}
            onChange={this.onChange}
            onClick={this.onClick}
            radioVal={this.state.radioName}
            onRadioChange={this.onRadioChange}
            placeholder={this.state.placeholder}
            loading={this.state.loading}
            yelpCategory={yelpCategory}
            handleYelpCategoryInput={this.handleYelpCategoryInput}
            yelpCategoryMatches={yelpCategoryMatches}
            selectYelpCategoryMatch={this.selectYelpCategoryMatch}
            getUserCurrentCoords={this.getUserCurrentCoords}
            locInput0a={this.state.locInput0a}
            locInput0b={this.state.locInput0b}
            locationLoading={locationLoading}
          />
        ) : (
          !this.state.result && (
            <Spinner fadeIn="none" name="pulse" color={colors.blue} />
          )
        )}
        <Maps
          result={this.state.result}
          midptInfo={this.state.midptInfo}
          onChoose={this.onChoose}
        />
      </div>
    );
  }
}

export default App;
